import { type NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { sanityWriteClient } from '@/sanity/writeClient'

/**
 * AI Article Drafting API endpoint
 *
 * Generates draft original_post documents in Sanity using Claude.
 *
 * Authentication: Bearer token via CRON_SECRET env var
 * Requires: ANTHROPIC_API_KEY env var
 *
 * Request body:
 * {
 *   topic: string          — The topic/title for the article
 *   keywords?: string[]    — Optional SEO keywords to target
 *   tone?: string          — Optional tone (default: "informative")
 *   categoryId?: string    — Optional Sanity category reference ID
 * }
 *
 * Pipeline:
 * 1. Accept a topic/brief as input
 * 2. Generate an outline + full article using Claude
 * 3. Convert to Sanity Portable Text blocks
 * 4. Create a draft original_post in Sanity
 */

interface DraftRequest {
  topic: string
  keywords?: string[]
  tone?: string
  categoryId?: string
}

interface GeneratedArticle {
  title: string
  excerpt: string
  sections: Array<{ heading: string; content: string }>
  metaTitle: string
  metaDescription: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

function articleToPortableText(
  article: GeneratedArticle,
): Array<{ _type: string; _key: string; style?: string; children?: Array<{ _type: string; _key: string; text: string; marks?: string[] }>; markDefs?: never[] }> {
  const blocks: Array<{ _type: string; _key: string; style?: string; children?: Array<{ _type: string; _key: string; text: string; marks?: string[] }>; markDefs?: never[] }> = []
  let keyIndex = 0

  const makeKey = () => {
    keyIndex++
    return `block-${keyIndex.toString(36).padStart(6, '0')}`
  }

  const makeTextBlock = (text: string, style = 'normal') => ({
    _type: 'block' as const,
    _key: makeKey(),
    style,
    markDefs: [] as never[],
    children: [{ _type: 'span' as const, _key: makeKey(), text, marks: [] as string[] }],
  })

  for (const section of article.sections) {
    blocks.push(makeTextBlock(section.heading, 'h2'))

    // Split content into paragraphs
    const paragraphs = section.content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)

    for (const para of paragraphs) {
      blocks.push(makeTextBlock(para))
    }
  }

  return blocks
}

async function generateArticle(
  client: Anthropic,
  topic: string,
  keywords: string[],
  tone: string,
): Promise<GeneratedArticle> {
  const keywordStr = keywords.length > 0 ? `\nTarget keywords: ${keywords.join(', ')}` : ''

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Write a tech blog article about: ${topic}
${keywordStr}
Tone: ${tone}

Respond in this exact JSON format (no markdown wrapping):
{
  "title": "Article title (compelling, SEO-friendly, under 70 chars)",
  "excerpt": "2-3 sentence summary for preview cards",
  "metaTitle": "SEO meta title (under 60 chars)",
  "metaDescription": "SEO meta description (under 155 chars)",
  "sections": [
    {
      "heading": "Section heading",
      "content": "2-4 paragraphs of content. Separate paragraphs with double newlines."
    }
  ]
}

Requirements:
- 4-6 sections with descriptive H2 headings
- Each section should have 2-4 substantive paragraphs
- Write for a technical audience that values clarity
- Include practical insights and actionable information
- Keep the total article between 800-1500 words`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // Parse JSON from response, handling potential markdown wrapping
  const jsonStr = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  const parsed = JSON.parse(jsonStr) as GeneratedArticle

  if (!parsed.title || !parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error('Invalid article structure from AI')
  }

  return parsed
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!sanityWriteClient) {
    return NextResponse.json(
      { success: false, message: 'Sanity write client not configured. Set SANITY_API_WRITE_TOKEN.' },
      { status: 503 },
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: 'ANTHROPIC_API_KEY not configured.' },
      { status: 503 },
    )
  }

  let body: DraftRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body. Required: { topic: string }' },
      { status: 400 },
    )
  }

  if (!body.topic || typeof body.topic !== 'string') {
    return NextResponse.json(
      { success: false, message: 'Missing required field: topic' },
      { status: 400 },
    )
  }

  try {
    const anthropic = new Anthropic({ apiKey })

    // 1. Generate article with Claude
    const article = await generateArticle(
      anthropic,
      body.topic,
      body.keywords || [],
      body.tone || 'informative',
    )

    // 2. Convert to Portable Text
    const portableTextBody = articleToPortableText(article)

    // 3. Create draft in Sanity
    const doc = await sanityWriteClient.create({
      _type: 'original_post',
      title: article.title,
      slug: { _type: 'slug', current: slugify(article.title) },
      excerpt: article.excerpt,
      publishedAt: new Date().toISOString(),
      body: portableTextBody,
      featured: false,
      seo: {
        _type: 'seo',
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
      },
      ...(body.categoryId && {
        categories: [{ _type: 'reference', _ref: body.categoryId }],
      }),
    })

    return NextResponse.json({
      success: true,
      message: `Draft article "${article.title}" created.`,
      documentId: doc._id,
      title: article.title,
      sectionCount: article.sections.length,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Draft generation error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new NextResponse(`Internal error: ${message}`, { status: 500 })
  }
}

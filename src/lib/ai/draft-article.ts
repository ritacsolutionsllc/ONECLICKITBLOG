import { getAiClient, AI_MODEL } from './client'

export interface ArticleBrief {
  topic: string
  angle?: string
  keywords?: string[]
  targetAudience?: string
}

export interface DraftedArticle {
  title: string
  excerpt: string
  headings: string[]
  body: ArticleSection[]
  seoTitle: string
  seoDescription: string
  suggestedTags: string[]
}

export interface ArticleSection {
  heading: string
  paragraphs: string[]
}

const DRAFT_SYSTEM_PROMPT = `You are a senior tech journalist writing original analysis for a technology news blog called OneClickIT. Your writing is sharp, direct, and authoritative. You explain complex topics clearly without dumbing them down.

Given an article brief, produce a structured article draft in this exact JSON format:
{
  "title": "<compelling headline, under 70 characters>",
  "excerpt": "<2-sentence TL;DR that opens with the direct answer>",
  "headings": ["<h2 section title 1>", "<h2 section title 2>", ...],
  "body": [
    {
      "heading": "<same as headings[0]>",
      "paragraphs": ["<paragraph 1>", "<paragraph 2>"]
    }
  ],
  "seoTitle": "<SEO-optimized title, under 60 chars>",
  "seoDescription": "<meta description, 140-160 chars, includes primary keyword>",
  "suggestedTags": ["tag1", "tag2", "tag3"]
}

Rules:
- Each section must have 2-3 paragraphs of 3-5 sentences.
- 4-6 sections total.
- Start with the most important information (inverted pyramid).
- No filler intros like "In today's rapidly evolving...". Start with the news or claim.
- Include one "What to watch" section at the end.
- Write in second person where appropriate ("you", "your team").
- Facts must be plausible; flag any uncertain claims with "(unconfirmed)".`

export async function draftArticle(brief: ArticleBrief): Promise<DraftedArticle> {
  const client = getAiClient()

  const userPrompt = [
    `Topic: ${brief.topic}`,
    brief.angle ? `Angle: ${brief.angle}` : null,
    brief.keywords?.length ? `Keywords to include: ${brief.keywords.join(', ')}` : null,
    brief.targetAudience ? `Target audience: ${brief.targetAudience}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const msg = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    system: DRAFT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI draft response did not contain valid JSON')

  return JSON.parse(jsonMatch[0]) as DraftedArticle
}

/**
 * Convert a DraftedArticle into Sanity Portable Text blocks.
 * Uses a minimal block structure compatible with the site's portableText schema.
 */
export function toPortableTextBlocks(article: DraftedArticle) {
  const blocks: object[] = []
  let keyCounter = 0

  function nextKey() {
    return `block-${++keyCounter}`
  }

  function textBlock(text: string, style: string = 'normal') {
    return {
      _type: 'block',
      _key: nextKey(),
      style,
      markDefs: [],
      children: [{ _type: 'span', _key: nextKey(), text, marks: [] }],
    }
  }

  for (const section of article.body) {
    blocks.push(textBlock(section.heading, 'h2'))
    for (const para of section.paragraphs) {
      blocks.push(textBlock(para, 'normal'))
    }
  }

  return blocks
}

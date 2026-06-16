import { type NextRequest, NextResponse } from 'next/server'
import { getWriteClient } from '@/lib/ingestion/sanity-write-client'
import { draftArticle, toPortableTextBlocks, type ArticleBrief } from '@/lib/ai/draft-article'
import { allActiveCategoriesQuery } from '@/lib/ingestion/queries'

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return cronSecret && authHeader === `Bearer ${cronSecret}`
}

interface DraftRequestBody {
  topic: string
  angle?: string
  keywords?: string[]
  targetAudience?: string
  categoryTitle?: string
}

interface Category {
  _id: string
  title: string
  slug: string
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 })
  }

  let body: DraftRequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.topic?.trim()) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 })
  }

  const brief: ArticleBrief = {
    topic: body.topic.trim(),
    angle: body.angle,
    keywords: body.keywords,
    targetAudience: body.targetAudience ?? 'tech professionals and developers',
  }

  try {
    const client = getWriteClient()

    const [draft, categories] = await Promise.all([
      draftArticle(brief),
      client.fetch<Category[]>(allActiveCategoriesQuery),
    ])

    const categoryMap = new Map(
      (categories ?? []).map((c) => [c.title.toLowerCase(), c._id]),
    )

    const categoryRef = body.categoryTitle
      ? categoryMap.get(body.categoryTitle.toLowerCase())
      : null

    const body_blocks = toPortableTextBlocks(draft)

    const slug = draft.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 96)

    const doc = await client.create({
      _type: 'original_post',
      title: draft.title,
      slug: { _type: 'slug', current: slug },
      excerpt: draft.excerpt,
      publishedAt: new Date().toISOString(),
      status: 'draft',
      aiGenerated: true,
      body: body_blocks,
      ...(categoryRef
        ? {
            categories: [{ _type: 'reference', _ref: categoryRef }],
          }
        : {}),
      seo: {
        _type: 'seo',
        metaTitle: draft.seoTitle,
        metaDescription: draft.seoDescription,
      },
    })

    return NextResponse.json({
      ok: true,
      postId: doc._id,
      slug,
      title: draft.title,
      sectionCount: draft.body.length,
      suggestedTags: draft.suggestedTags,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Draft generation error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

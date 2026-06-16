import { type NextRequest, NextResponse } from 'next/server'
import { getWriteClient } from '@/lib/ingestion/sanity-write-client'
import { recentDigestHeadlinesQuery, allActiveCategoriesQuery } from '@/lib/ingestion/queries'
import { discoverTrends } from '@/lib/ai/discover-trends'

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return cronSecret && authHeader === `Bearer ${cronSecret}`
}

export async function GET(req: NextRequest) {
  return handleTrends(req)
}

export async function POST(req: NextRequest) {
  return handleTrends(req)
}

interface HeadlineItem {
  headline: string
  summary?: string
  category?: string
}

interface Category {
  _id: string
  title: string
  slug: string
}

async function handleTrends(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 })
  }

  try {
    const client = getWriteClient()

    // Fetch headlines from the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [headlines, categories] = await Promise.all([
      client.fetch<HeadlineItem[]>(recentDigestHeadlinesQuery, {
        since: sevenDaysAgo.toISOString(),
      }),
      client.fetch<Category[]>(allActiveCategoriesQuery),
    ])

    if (!headlines || headlines.length < 5) {
      return NextResponse.json(
        { message: 'Insufficient data: fewer than 5 digest items in the last 7 days', itemCount: headlines?.length ?? 0 },
        { status: 200 },
      )
    }

    const trends = await discoverTrends(headlines)

    if (trends.length === 0) {
      return NextResponse.json({ message: 'AI returned no trends', itemCount: headlines.length }, { status: 200 })
    }

    // Build a category lookup map by title (case-insensitive)
    const categoryMap = new Map(
      (categories ?? []).map((c) => [c.title.toLowerCase(), c._id]),
    )

    const today = new Date()
    const dateSlug = today.toISOString().split('T')[0]
    const docId = `trend-radar-${dateSlug}`

    const trendItems = trends.map((t, i) => ({
      _type: 'trendItem',
      _key: `trend-${i}-${dateSlug}`,
      title: t.title,
      description: t.description,
      momentum: t.momentum,
      score: t.score,
      ...(t.categoryTitle
        ? {
            category: {
              _type: 'reference',
              _ref: categoryMap.get(t.categoryTitle.toLowerCase()) ?? null,
            },
          }
        : {}),
    })).filter((t) => !t.category || t.category._ref)

    await client.createOrReplace({
      _type: 'trend_radar',
      _id: docId,
      title: `Trend Radar – ${today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      slug: { _type: 'slug', current: `trend-radar-${dateSlug}` },
      publishedAt: today.toISOString(),
      description: `Top ${trends.length} technology trends extracted from ${headlines.length} recent news items.`,
      trends: trendItems,
    })

    return NextResponse.json({
      ok: true,
      trendsGenerated: trends.length,
      headlinesAnalysed: headlines.length,
      docId,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Trend discovery error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

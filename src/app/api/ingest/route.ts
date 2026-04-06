import { type NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { sanityFetch } from '@/sanity/fetch'
import { sanityWriteClient } from '@/sanity/writeClient'
import { activeSourcesQuery } from '@/sanity/lib/queries'

interface SanitySource {
  _id: string
  name: string
  slug: string
  url: string
  category?: { _id: string }
}

interface FeedItem {
  headline: string
  sourceUrl: string
  summary: string
  sourceRef: string
}

const parser = new Parser({
  timeout: 10_000,
  headers: { 'User-Agent': 'OneClickIT-Blog-Ingester/1.0' },
})

function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  return cronSecret && authHeader === `Bearer ${cronSecret}`
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

async function fetchFeedItems(source: SanitySource): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(source.url)
    return (feed.items ?? []).slice(0, 10).map((item) => ({
      headline: item.title ?? 'Untitled',
      sourceUrl: item.link ?? '',
      summary: item.contentSnippet?.slice(0, 300) ?? item.content?.slice(0, 300) ?? '',
      sourceRef: source._id,
    }))
  } catch (err) {
    console.error(`Failed to fetch feed from ${source.name} (${source.url}):`, err)
    return []
  }
}

function deduplicateItems(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = item.sourceUrl || item.headline
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function GET(req: NextRequest) {
  return handleIngest(req)
}

export async function POST(req: NextRequest) {
  return handleIngest(req)
}

async function handleIngest(req: NextRequest) {
  if (!checkAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  if (!sanityWriteClient) {
    return NextResponse.json(
      { success: false, message: 'Sanity write client not configured. Set SANITY_API_WRITE_TOKEN.' },
      { status: 503 },
    )
  }

  try {
    // 1. Fetch active RSS sources from Sanity
    const sources = await sanityFetch<SanitySource[]>({
      query: activeSourcesQuery,
      tags: ['source'],
    })

    if (!sources || sources.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active RSS sources found.',
        timestamp: new Date().toISOString(),
      })
    }

    // 2. Fetch RSS feeds in parallel
    const feedResults = await Promise.all(sources.map(fetchFeedItems))
    const allItems = feedResults.flat()

    // 3. Deduplicate by URL/headline
    const uniqueItems = deduplicateItems(allItems)

    if (uniqueItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new items found from feeds.',
        sourcesPolled: sources.length,
        timestamp: new Date().toISOString(),
      })
    }

    // 4. Create a draft news_digest in Sanity
    const today = new Date().toISOString().split('T')[0]
    const title = `Tech Digest — ${today}`
    const slug = slugify(title)

    const digestItems = uniqueItems.map((item) => ({
      _type: 'digestItem' as const,
      _key: crypto.randomUUID().replace(/-/g, '').slice(0, 12),
      headline: item.headline,
      sourceUrl: item.sourceUrl,
      summary: item.summary,
      source: { _type: 'reference' as const, _ref: item.sourceRef },
    }))

    const doc = await sanityWriteClient.create({
      _type: 'news_digest',
      title,
      slug: { _type: 'slug', current: slug },
      publishedAt: new Date().toISOString(),
      status: 'draft',
      items: digestItems,
      summary: `Auto-generated digest with ${uniqueItems.length} items from ${sources.length} sources.`,
    })

    return NextResponse.json({
      success: true,
      message: `Created draft digest "${title}" with ${uniqueItems.length} items.`,
      documentId: doc._id,
      sourcesPolled: sources.length,
      itemsIngested: uniqueItems.length,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Ingestion error:', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

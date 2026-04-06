import { type NextRequest, NextResponse } from 'next/server'
import { sanityFetch } from '@/sanity/fetch'
import { sanityWriteClient } from '@/sanity/writeClient'
import { groq } from 'next-sanity'

/**
 * Trend Discovery API endpoint
 *
 * Discovers trending topics by analyzing recent digest items and existing content,
 * then creates/updates a trend_radar document in Sanity.
 *
 * Authentication: Bearer token via CRON_SECRET env var
 *
 * Pipeline:
 * 1. Fetch recent digest items as demand signals
 * 2. Fetch existing categories for classification
 * 3. Score topics by frequency and recency
 * 4. Create/update trend_radar document in Sanity
 */

interface DigestSignal {
  headline: string
  publishedAt: string
  category?: { _id: string; title: string }
}

interface CategoryInfo {
  _id: string
  title: string
  slug: string
}

interface ScoredTrend {
  title: string
  description: string
  momentum: 'rising' | 'stable' | 'declining'
  score: number
  categoryId?: string
}

const recentDigestItemsQuery = groq`*[_type == "news_digest" && defined(publishedAt)] | order(publishedAt desc)[0...10] {
  publishedAt,
  items[] {
    headline,
    source->{ name },
    "category": ^.category->{ _id, title }
  }
}`

const existingTrendRadarQuery = groq`*[_type == "trend_radar"] | order(publishedAt desc)[0] {
  _id,
  trends[] { title }
}`

const allCategoriesForTrendsQuery = groq`*[_type == "category"] { _id, title, "slug": slug.current }`

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

function extractKeywords(headline: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both',
    'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than',
    'too', 'very', 'just', 'because', 'how', 'what', 'which', 'who',
    'when', 'where', 'why', 'this', 'that', 'these', 'those', 'it', 'its',
    'new', 'says', 'said', 'also', 'get', 'gets', 'got', 'like', 'make',
    'makes', 'made', 'first', 'now', 'way', 'may', 'many', 'much',
  ])

  return headline
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
}

function scoreTrends(
  digests: Array<{ publishedAt: string; items?: DigestSignal[] }>,
  categories: CategoryInfo[],
): ScoredTrend[] {
  const topicCounts = new Map<string, { count: number; recency: number; categoryId?: string }>()
  const now = Date.now()

  for (const digest of digests) {
    if (!digest.items) continue
    const ageInDays = (now - new Date(digest.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
    const recencyWeight = Math.max(0, 1 - ageInDays / 30) // Decay over 30 days

    for (const item of digest.items) {
      const keywords = extractKeywords(item.headline)
      for (const keyword of keywords) {
        const existing = topicCounts.get(keyword) || { count: 0, recency: 0 }
        existing.count += 1
        existing.recency = Math.max(existing.recency, recencyWeight)
        if (item.category?._id) {
          existing.categoryId = item.category._id
        }
        topicCounts.set(keyword, existing)
      }
    }
  }

  // Score and rank
  const scored: ScoredTrend[] = []
  for (const [keyword, data] of Array.from(topicCounts.entries())) {
    const score = data.count * (0.5 + data.recency * 0.5)
    if (data.count < 2) continue // Need at least 2 mentions

    const momentum: 'rising' | 'stable' | 'declining' =
      data.recency > 0.7 ? 'rising' : data.recency > 0.3 ? 'stable' : 'declining'

    const category = categories.find((c) => c._id === data.categoryId)

    scored.push({
      title: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      description: `Mentioned ${data.count} times in recent digests.`,
      momentum,
      score,
      categoryId: category?._id,
    })
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, 15)
}

export async function GET(req: NextRequest) {
  return handleTrends(req)
}

export async function POST(req: NextRequest) {
  return handleTrends(req)
}

async function handleTrends(req: NextRequest) {
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
    // 1. Fetch signals and categories in parallel
    const [digests, categories, existingRadar] = await Promise.all([
      sanityFetch<Array<{ publishedAt: string; items?: DigestSignal[] }>>({
        query: recentDigestItemsQuery,
        tags: ['digest'],
      }),
      sanityFetch<CategoryInfo[]>({
        query: allCategoriesForTrendsQuery,
        tags: ['category'],
      }),
      sanityFetch<{ _id: string; trends?: Array<{ title: string }> } | null>({
        query: existingTrendRadarQuery,
        tags: ['trend'],
      }),
    ])

    if (!digests || digests.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No digest data available for trend analysis.',
        timestamp: new Date().toISOString(),
      })
    }

    // 2. Score and rank trends
    const scored = scoreTrends(digests, categories || [])

    if (scored.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No significant trends detected.',
        digestsAnalyzed: digests.length,
        timestamp: new Date().toISOString(),
      })
    }

    // 3. Build trend items
    const trendItems = scored.map((trend) => ({
      _type: 'trendItem' as const,
      _key: crypto.randomUUID().replace(/-/g, '').slice(0, 12),
      title: trend.title,
      description: trend.description,
      momentum: trend.momentum,
      ...(trend.categoryId && {
        category: { _type: 'reference' as const, _ref: trend.categoryId },
      }),
    }))

    // 4. Create or update trend_radar document
    const today = new Date().toISOString().split('T')[0]
    const title = `Trend Radar — ${today}`

    let documentId: string

    if (existingRadar?._id) {
      // Update existing document
      await sanityWriteClient
        .patch(existingRadar._id)
        .set({
          title,
          slug: { _type: 'slug', current: slugify(title) },
          publishedAt: new Date().toISOString(),
          description: `Auto-generated trend analysis from ${digests.length} recent digests. ${scored.length} trending topics identified.`,
          trends: trendItems,
        })
        .commit()
      documentId = existingRadar._id
    } else {
      const doc = await sanityWriteClient.create({
        _type: 'trend_radar',
        title,
        slug: { _type: 'slug', current: slugify(title) },
        publishedAt: new Date().toISOString(),
        description: `Auto-generated trend analysis from ${digests.length} recent digests. ${scored.length} trending topics identified.`,
        trends: trendItems,
      })
      documentId = doc._id
    }

    return NextResponse.json({
      success: true,
      message: `Trend radar updated with ${scored.length} trends.`,
      documentId,
      trendsFound: scored.length,
      digestsAnalyzed: digests.length,
      topTrends: scored.slice(0, 5).map((t) => t.title),
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Trend discovery error:', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

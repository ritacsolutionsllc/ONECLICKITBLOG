import { type NextRequest, NextResponse } from 'next/server'
import { groq } from 'next-sanity'
import { getWriteClient } from '@/lib/ingestion/sanity-write-client'
import { extractKeywords } from '@/lib/trends/extractor'

type CategoryRow = { _id: string; slug: string }

// Fetch all headlines from digest items published in the past N days
const recentHeadlinesQuery = groq`*[
  _type == "news_digest"
  && publishedAt > $since
] { "headlines": items[].headline }.headlines[]`

// Fetch category refs for building trendItem references
const allCategoriesQuery = groq`*[_type == "category"] {
  _id, "slug": slug.current
}`

// Keyword → category slug heuristic
const CATEGORY_SIGNALS: [string, RegExp][] = [
  ['ai-ml',        /\b(ai|gpt|llm|openai|anthropic|gemini|claude|mistral|llama|deep\s?learning|neural|generative|copilot)\b/i],
  ['cybersecurity', /\b(security|vuln|cve|exploit|breach|malware|ransomware|phishing|zero[- ]day|patch|attack)\b/i],
  ['cloud-devops',  /\b(cloud|aws|azure|gcp|kubernetes|k8s|docker|serverless|devops|terraform|container)\b/i],
  ['hardware',      /\b(chip|gpu|cpu|nvidia|intel|amd|processor|silicon|semiconductor|m[1-9]|snapdragon)\b/i],
  ['dev-tools',     /\b(typescript|javascript|python|rust|react|nextjs|github|sdk|framework|library|open\s*source)\b/i],
]

function categoryForKeyword(keyword: string): string {
  for (const [slug, re] of CATEGORY_SIGNALS) {
    if (re.test(keyword)) return slug
  }
  return 'dev-tools'
}

function getWeekSlug(): string {
  const d = new Date()
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(
    ((d.getTime() - jan1.getTime()) / 86_400_000 + jan1.getDay() + 1) / 7,
  )
  return `${d.getFullYear()}-w${String(week).padStart(2, '0')}`
}

function checkAuth(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  return Boolean(secret && auth === `Bearer ${secret}`)
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

  try {
    const client = getWriteClient()

    // Pull headlines from the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const rawHeadlines = await client.fetch<(string | null)[]>(
      recentHeadlinesQuery,
      { since: sevenDaysAgo.toISOString() },
    )
    const headlines = (rawHeadlines || []).filter(Boolean) as string[]

    if (headlines.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No recent digest items — run ingestion first.',
      })
    }

    // Extract top trending keywords
    const keywords = extractKeywords(headlines, 15)
    if (keywords.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Insufficient data for trend extraction.',
      })
    }

    // Fetch categories for reference resolution
    const categories =
      (await client.fetch<CategoryRow[]>(allCategoriesQuery)) || []
    const catMap = new Map(categories.map((c) => [c.slug, c._id]))

    // Build trendItem array (top 12 keywords)
    const trendItems = keywords.slice(0, 12).map((kw, i) => {
      const catSlug = categoryForKeyword(kw.keyword)
      const catId = catMap.get(catSlug)
      return {
        _type: 'trendItem',
        _key: `kw-${i}-${kw.keyword.replace(/\s+/g, '-').slice(0, 30)}`,
        title: kw.keyword.charAt(0).toUpperCase() + kw.keyword.slice(1),
        description: `Appeared in ${kw.count} stories over the past 7 days.`,
        momentum: kw.momentum,
        ...(catId ? { category: { _type: 'reference', _ref: catId } } : {}),
      }
    })

    // Create or replace this week's trend radar document
    const weekSlug = getWeekSlug()
    const today = new Date()
    const doc = await client.createOrReplace({
      _id: `trend-radar-${weekSlug}`,
      _type: 'trend_radar',
      title: `Trend Radar – ${today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}`,
      slug: { _type: 'slug', current: `trend-radar-${weekSlug}` },
      publishedAt: today.toISOString(),
      description: `Top trending topics extracted from ${headlines.length} headlines over the past 7 days.`,
      trends: trendItems,
    })

    return NextResponse.json({
      success: true,
      trendRadarId: doc._id,
      headlinesAnalyzed: headlines.length,
      keywordsFound: keywords.length,
      trendItemsCreated: trendItems.length,
    })
  } catch (err) {
    console.error('Trend discovery error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

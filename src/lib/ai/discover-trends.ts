import { getAiClient, AI_MODEL } from './client'

interface HeadlineItem {
  headline: string
  summary?: string
  category?: string
}

export interface ScoredTrend {
  title: string
  description: string
  momentum: 'rising' | 'stable' | 'declining'
  score: number
  categoryTitle?: string
}

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','has','have','had','do','does','did',
  'will','would','could','should','may','might','can','not','no','it','its',
  'this','that','these','those','by','from','as','up','out','new','now',
  'over','after','before','about','into','through','than','more','most',
  'just','also','how','what','when','where','who','why','which','their',
  'they','them','he','she','we','you','i','my','our','your','his','her',
  'says','said','report','reports','us','—','&','vs',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
}

interface TokenFreq {
  token: string
  count: number
  categories: Set<string>
}

/**
 * Count keyword frequencies across all headlines and summaries.
 * Returns the top N tokens by frequency.
 */
function countFrequencies(items: HeadlineItem[], topN = 40): TokenFreq[] {
  const freq = new Map<string, TokenFreq>()

  for (const item of items) {
    const text = `${item.headline} ${item.summary ?? ''}`
    const tokens = tokenize(text)
    const seen = new Set<string>()

    for (const token of tokens) {
      if (seen.has(token)) continue
      seen.add(token)

      if (!freq.has(token)) {
        freq.set(token, { token, count: 0, categories: new Set() })
      }
      const entry = freq.get(token)!
      entry.count++
      if (item.category) entry.categories.add(item.category)
    }
  }

  return Array.from(freq.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)
}

const TREND_SYSTEM_PROMPT = `You are a senior tech analyst identifying the most important emerging trends from a list of keyword frequencies extracted from recent tech news headlines.

Given a JSON array of {token, count, categories} objects, identify the top 8 meaningful technology trends. Group related tokens into coherent trend names. Ignore generic words that are not actionable trends.

Respond ONLY with a JSON array of trend objects in this exact shape:
[
  {
    "title": "<short trend name, 2-5 words>",
    "description": "<2-3 sentence analyst take on this trend and why it is gaining momentum right now>",
    "momentum": "rising" | "stable" | "declining",
    "score": <integer 0-100 representing relevance and momentum>,
    "categoryTitle": "<most relevant category from the data, or null>"
  }
]
Order by score descending. Be specific and editorial. No generic trends like "technology advances".`

export async function discoverTrends(items: HeadlineItem[]): Promise<ScoredTrend[]> {
  const topTokens = countFrequencies(items)

  if (topTokens.length === 0) return []

  const payload = topTokens.map(({ token, count, categories }) => ({
    token,
    count,
    categories: Array.from(categories),
  }))

  const client = getAiClient()
  const msg = await client.messages.create({
    model: AI_MODEL,
    max_tokens: 2048,
    system: TREND_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: JSON.stringify(payload),
      },
    ],
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Trend AI response did not contain a JSON array')

  const trends: ScoredTrend[] = JSON.parse(jsonMatch[0])
  return trends
}

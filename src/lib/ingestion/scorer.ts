import type { NormalizedItem, Priority } from './types'

// Patterns that signal breaking or high-urgency news
const BREAKING_RE =
  /\b(zero[- ]day|critical\s+vuln|data\s+breach|hack(ed)?|ransomware\s+attack|goes?\s+down|outage|raises?\s+\$\d|acquired?\s+by|ipo\s+(files?|launches?|prices?)|bankrupt|shuts?\s+down|lays?\s+off|emergency\s+patch|mass\s+layoff|cve-\d{4})\b/i

// Topic signal patterns mapped to relevance weight
const TOPIC_RE: Record<string, RegExp> = {
  ai: /\b(ai|gpt|llm|openai|anthropic|gemini|claude|mistral|llama|deep\s?learning|neural\s+net|foundation\s+model|generative|copilot|diffusion\s+model|transformer)\b/i,
  security: /\b(vuln|cve-?\d|exploit|breach|malware|ransomware|phishing|zero[- ]day|patch|backdoor|trojan|ddos|attack|infosec|pentest)\b/i,
  cloud: /\b(aws|azure|gcp|cloud\s+platform|kubernetes|k8s|docker|serverless|devops|terraform|lambda|container\s+orchestration)\b/i,
  startup: /\b(startup|raises?|funding|series [abcde]|seed\s+round|ipo|unicorn|valuation|venture\s+capital|acqui(?:res?|sition))\b/i,
  hardware: /\b(chip|gpu|cpu|nvidia|intel|amd|arm|quantum\s+chip|processor|silicon|semiconductor|m[1-9]\s|snapdragon)\b/i,
  dev: /\b(typescript|javascript|python|rust|golang|react|nextjs|node\.?js|open\s+source|github|sdk|framework|library|api)\b/i,
}

/**
 * Score a single item by breaking-news signal, topic relevance, and recency.
 * Returns a numeric score and a priority label.
 */
export function scoreItem(
  item: Pick<NormalizedItem, 'headline' | 'summary' | 'publishedAt'>,
): { score: number; priority: Priority } {
  const text = `${item.headline} ${item.summary}`
  const ageHours =
    (Date.now() - new Date(item.publishedAt).getTime()) / 3_600_000

  const isBreaking = BREAKING_RE.test(text)

  // Count how many topic categories the item touches (max 6 hits × 1.5 = 9)
  const topicHits = Object.values(TOPIC_RE).reduce(
    (n, re) => n + (re.test(text) ? 1 : 0),
    0,
  )

  // Recency: full weight at 0h, decays linearly to 0 at 48h
  const recencyScore = Math.max(0, 1 - ageHours / 48) * 4

  const score = (isBreaking ? 10 : 0) + topicHits * 1.5 + recencyScore

  const priority: Priority = isBreaking
    ? 'breaking'
    : score >= 6
    ? 'high'
    : score >= 3
    ? 'medium'
    : 'low'

  return { score, priority }
}

/**
 * Score and sort a list of items. Returns highest-scoring items first.
 * Attaches score and priority to each item.
 */
export function rankItems(items: NormalizedItem[]): NormalizedItem[] {
  return items
    .map((item) => {
      const { score, priority } = scoreItem(item)
      return { ...item, score, priority }
    })
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
}

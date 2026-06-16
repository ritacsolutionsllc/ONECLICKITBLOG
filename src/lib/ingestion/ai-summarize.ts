import type { NormalizedItem } from './types'

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'
const TIMEOUT_MS = 12_000
const MIN_SUMMARY_LENGTH = 40

async function callAnthropic(prompt: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 120,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    if (!res.ok) {
      console.warn(`Anthropic API error ${res.status}:`, await res.text())
      return null
    }

    const data = (await res.json()) as { content: { text: string }[] }
    return data.content[0]?.text?.trim() || null
  } catch (err) {
    console.warn('Anthropic API call failed:', err instanceof Error ? err.message : err)
    return null
  }
}

/**
 * Generate one-sentence "why it matters" AI takes for a batch of items.
 *
 * Returns a Map of item.hash → aiTake string.
 * Silently skips items with short summaries.
 * Returns an empty Map if ANTHROPIC_API_KEY is not set — callers don't need to check.
 *
 * Processes sequentially to stay within Anthropic rate limits.
 * Budget: 120 tokens × N items. Keep N ≤ 10 per pipeline run.
 */
export async function generateAiTakes(
  items: NormalizedItem[],
): Promise<Map<string, string>> {
  const result = new Map<string, string>()

  if (!process.env.ANTHROPIC_API_KEY) return result

  for (const item of items) {
    if (!item.summary || item.summary.length < MIN_SUMMARY_LENGTH) continue

    const prompt =
      `You are a sharp tech news editor writing for IT professionals. ` +
      `Read this headline and summary, then write ONE concise sentence explaining why it matters. ` +
      `Be direct — no hedging, no "it's important because", no fluff.\n\n` +
      `Headline: ${item.headline}\n` +
      `Summary: ${item.summary}\n\n` +
      `One sentence only:`

    const take = await callAnthropic(prompt)
    if (take) result.set(item.hash, take)
  }

  return result
}

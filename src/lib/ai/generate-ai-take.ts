import { getAiClient, AI_MODEL } from './client'
import type { NormalizedItem } from '../ingestion/types'

const SYSTEM_PROMPT = `You are a sharp tech editor writing brief "Why it matters" callouts for a tech news digest.
For each story, respond with ONLY a JSON object in this exact shape:
{
  "summary": "<one crisp sentence summarising the development>",
  "context": ["<bullet 1: key background fact>", "<bullet 2: broader implication>"],
  "why": "<one sentence on why this matters to tech professionals>"
}
Be direct. No fluff. No markdown formatting inside values. Max 25 words per field.`

export interface AiTake {
  summary: string
  context: [string, string]
  why: string
}

function formatAiTake(take: AiTake): string {
  return `${take.summary} • ${take.context.join(' • ')} • Why it matters: ${take.why}`
}

async function generateSingle(item: NormalizedItem): Promise<string | null> {
  const client = getAiClient()
  try {
    const msg = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Headline: ${item.headline}\nSummary: ${item.summary || '(no summary)'}`,
        },
      ],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : null
    if (!text) return null

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null

    const take: AiTake = JSON.parse(jsonMatch[0])
    return formatAiTake(take)
  } catch {
    return null
  }
}

/**
 * Generate aiTake strings for a batch of items.
 * Returns a Map keyed by item.hash → aiTake string.
 * Items where AI generation fails are simply omitted (field stays empty).
 * Runs at most MAX_CONCURRENT calls in parallel to stay within rate limits.
 */
export async function generateAiTakes(
  items: NormalizedItem[],
): Promise<Map<string, string>> {
  const MAX_CONCURRENT = 5
  const results = new Map<string, string>()

  for (let i = 0; i < items.length; i += MAX_CONCURRENT) {
    const batch = items.slice(i, i + MAX_CONCURRENT)
    const settled = await Promise.allSettled(
      batch.map((item) => generateSingle(item).then((take) => ({ hash: item.hash, take }))),
    )
    for (const result of settled) {
      if (result.status === 'fulfilled' && result.value.take) {
        results.set(result.value.hash, result.value.take)
      }
    }
  }

  return results
}

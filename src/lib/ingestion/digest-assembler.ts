import type { NormalizedItem } from './types'
import { getWriteClient } from './sanity-write-client'
import { generateAiTakes } from '../ai/generate-ai-take'

function toDigestItem(item: NormalizedItem, aiTake?: string) {
  return {
    _type: 'digestItem',
    _key: item.hash,
    headline: item.headline,
    sourceUrl: item.sourceUrl,
    source: {
      _type: 'reference',
      _ref: item.sourceRef,
    },
    summary: item.summary,
    ...(aiTake ? { aiTake } : {}),
  }
}

function formatDateSlug(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Create a new draft news_digest document in Sanity,
 * or append items to today's existing draft digest.
 *
 * If ANTHROPIC_API_KEY is set, generates an aiTake callout for every item
 * before writing. Items where AI generation fails are saved without aiTake.
 */
export async function assembleDigest(
  items: NormalizedItem[],
  existingDigestId?: string,
): Promise<{ digestId: string; itemCount: number }> {
  const client = getWriteClient()
  const today = new Date()
  const dateSlug = formatDateSlug(today)

  // Generate aiTake callouts when the AI key is available
  let aiTakes = new Map<string, string>()
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      aiTakes = await generateAiTakes(items)
    } catch {
      // Non-fatal: proceed without AI callouts
    }
  }

  const digestItems = items.map((item) => toDigestItem(item, aiTakes.get(item.hash)))

  if (existingDigestId) {
    await client
      .patch(existingDigestId)
      .setIfMissing({ items: [] })
      .append('items', digestItems)
      .commit()

    return { digestId: existingDigestId, itemCount: digestItems.length }
  }

  const title = `Daily Brief – ${today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`

  const doc = await client.create({
    _type: 'news_digest',
    title,
    slug: { _type: 'slug', current: `daily-brief-${dateSlug}` },
    publishedAt: today.toISOString(),
    summary: `${items.length} stories from across the tech landscape.`,
    status: 'draft',
    items: digestItems,
  })

  return { digestId: doc._id, itemCount: digestItems.length }
}

import type { NormalizedItem } from './types'
import { getWriteClient } from './sanity-write-client'

/**
 * Shape a NormalizedItem into a Sanity digestItem object.
 */
function toDigestItem(item: NormalizedItem) {
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
    ...(item.aiTake ? { aiTake: item.aiTake } : {}),
    ...(item.priority ? { priority: item.priority } : {}),
  }
}

/**
 * Build a date string like "2026-04-06" from a Date.
 */
function formatDateSlug(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Create a new draft news_digest document in Sanity,
 * or append items to today's existing draft digest.
 */
export async function assembleDigest(
  items: NormalizedItem[],
  existingDigestId?: string,
): Promise<{ digestId: string; itemCount: number }> {
  const client = getWriteClient()
  const today = new Date()
  const dateSlug = formatDateSlug(today)
  const digestItems = items.map(toDigestItem)

  if (existingDigestId) {
    // Append new items to existing draft digest
    await client
      .patch(existingDigestId)
      .setIfMissing({ items: [] })
      .append('items', digestItems)
      .commit()

    return { digestId: existingDigestId, itemCount: digestItems.length }
  }

  // Create a new draft digest
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

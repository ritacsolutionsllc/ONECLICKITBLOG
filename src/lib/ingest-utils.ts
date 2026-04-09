/**
 * Shared ingest utilities used by the ingest API route and tests.
 */

export interface FeedItem {
  headline: string
  sourceUrl: string
  summary: string
  sourceRef: string
}

export function deduplicateItems(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = item.sourceUrl || `${item.sourceRef}:${item.headline}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

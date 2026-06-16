/** A source document as fetched from Sanity */
export interface IngestionSource {
  _id: string
  name: string
  slug: string
  url: string
  type: 'rss' | 'api' | 'manual'
  active: boolean
  category?: {
    _id: string
    title: string
    slug: string
  }
}

/** A single item parsed from an RSS feed */
export interface ParsedFeedItem {
  title: string
  link: string
  summary: string
  publishedAt: string
  guid: string
}

export type Priority = 'breaking' | 'high' | 'medium' | 'low'

/** A normalized item ready for dedup and storage */
export interface NormalizedItem {
  headline: string
  sourceUrl: string
  sourceRef: string   // Sanity source document _id
  sourceName: string
  summary: string
  publishedAt: string
  hash: string        // SHA-256 of guid or link for dedup
  categoryRef?: string // Sanity category _id
  priority?: Priority
  score?: number
  aiTake?: string
}

/** Result of the full ingestion run */
export interface IngestionResult {
  sourcesProcessed: number
  itemsFetched: number
  itemsNew: number
  itemsDuplicate: number
  digestCreated: boolean
  digestId?: string
  errors: string[]
}

import { describe, it, expect } from 'vitest'

// Test the slugify and deduplication logic from the ingest route

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

interface FeedItem {
  headline: string
  sourceUrl: string
  summary: string
  sourceRef: string
}

function deduplicateItems(items: FeedItem[]): FeedItem[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = item.sourceUrl || item.headline
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

describe('slugify', () => {
  it('converts text to lowercase kebab-case', () => {
    expect(slugify('Tech Digest — 2024-06-15')).toBe('tech-digest-2024-06-15')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('---hello---')).toBe('hello')
  })

  it('truncates to 96 characters', () => {
    const long = 'a'.repeat(200)
    expect(slugify(long).length).toBe(96)
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })

  it('collapses multiple separators into single hyphen', () => {
    expect(slugify('hello   world')).toBe('hello-world')
  })
})

describe('deduplicateItems', () => {
  const makeItem = (headline: string, sourceUrl: string): FeedItem => ({
    headline,
    sourceUrl,
    summary: '',
    sourceRef: 'ref-1',
  })

  it('removes duplicates by URL', () => {
    const items = [
      makeItem('Article A', 'https://example.com/a'),
      makeItem('Article B', 'https://example.com/a'),
    ]
    const result = deduplicateItems(items)
    expect(result).toHaveLength(1)
    expect(result[0].headline).toBe('Article A')
  })

  it('falls back to headline for dedup when URL is empty', () => {
    const items = [
      makeItem('Same Headline', ''),
      makeItem('Same Headline', ''),
    ]
    const result = deduplicateItems(items)
    expect(result).toHaveLength(1)
  })

  it('keeps items with different URLs', () => {
    const items = [
      makeItem('Article A', 'https://example.com/a'),
      makeItem('Article B', 'https://example.com/b'),
    ]
    expect(deduplicateItems(items)).toHaveLength(2)
  })

  it('returns empty array for empty input', () => {
    expect(deduplicateItems([])).toHaveLength(0)
  })
})

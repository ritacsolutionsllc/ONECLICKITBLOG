import RSSParser from 'rss-parser'
import type { IngestionSource, ParsedFeedItem } from './types'

const parser = new RSSParser({
  timeout: 15_000,
  headers: {
    'User-Agent': 'OneClickIT-Bot/1.0 (+https://oneclickittoday.com)',
  },
})

/**
 * Fetch and parse an RSS feed from a source.
 * Returns normalized items sorted by date descending.
 * Gracefully returns empty array on fetch/parse failure.
 */
export async function parseFeed(
  source: IngestionSource,
  maxItems = 20,
): Promise<{ items: ParsedFeedItem[]; error?: string }> {
  try {
    const feed = await parser.parseURL(source.url)

    const items: ParsedFeedItem[] = (feed.items || [])
      .slice(0, maxItems)
      .map((item) => ({
        title: cleanText(item.title || 'Untitled'),
        link: item.link || '',
        summary: cleanText(
          item.contentSnippet || item.content || item.summary || '',
          300,
        ),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        guid: item.guid || item.link || item.title || '',
      }))
      .filter((item) => item.link) // drop items without a link

    return { items }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      items: [],
      error: `Failed to parse feed for "${source.name}": ${message}`,
    }
  }
}

/** Strip HTML tags and trim to maxLength */
function cleanText(raw: string, maxLength = 500): string {
  const text = raw
    .replace(/<[^>]*>/g, '')    // strip HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')       // collapse whitespace
    .trim()

  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).replace(/\s\S*$/, '') + '...'
}

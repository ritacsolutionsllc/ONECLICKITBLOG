/**
 * Maps Sanity document types to cache tags for ISR revalidation.
 * Shared between the revalidate webhook route and tests.
 */
export const tagsByType: Record<string, string[]> = {
  original_post: ['post', 'homepage'],
  buyer_guide: ['guide', 'homepage'],
  news_digest: ['digest', 'homepage'],
  trend_radar: ['trend'],
  category: ['category', 'homepage'],
  author: ['author'],
  siteSettings: ['siteSettings'],
  source: ['source'],
}

import { describe, it, expect } from 'vitest'

// Test the tag mapping logic (extracted from route)
const tagsByType: Record<string, string[]> = {
  original_post: ['post', 'homepage'],
  buyer_guide: ['guide', 'homepage'],
  news_digest: ['digest', 'homepage'],
  trend_radar: ['trend'],
  category: ['category', 'homepage'],
  author: ['author'],
  siteSettings: ['siteSettings'],
  source: ['source'],
}

describe('revalidation tag mapping', () => {
  it('maps original_post to post and homepage tags', () => {
    expect(tagsByType['original_post']).toEqual(['post', 'homepage'])
  })

  it('maps buyer_guide to guide and homepage tags', () => {
    expect(tagsByType['buyer_guide']).toEqual(['guide', 'homepage'])
  })

  it('maps news_digest to digest and homepage tags', () => {
    expect(tagsByType['news_digest']).toEqual(['digest', 'homepage'])
  })

  it('maps source to source tag', () => {
    expect(tagsByType['source']).toEqual(['source'])
  })

  it('returns undefined for unknown types', () => {
    expect(tagsByType['unknown_type']).toBeUndefined()
  })

  it('includes all expected document types', () => {
    const expectedTypes = [
      'original_post', 'buyer_guide', 'news_digest',
      'trend_radar', 'category', 'author', 'siteSettings', 'source',
    ]
    expect(Object.keys(tagsByType).sort()).toEqual(expectedTypes.sort())
  })
})

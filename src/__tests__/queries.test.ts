import { describe, it, expect } from 'vitest'
import {
  digestBySlugQuery,
  allDigestSlugsQuery,
  activeSourcesQuery,
} from '@/sanity/lib/queries'

describe('GROQ queries', () => {
  describe('digestBySlugQuery', () => {
    it('filters by published status', () => {
      expect(digestBySlugQuery).toContain('status == "published"')
    })

    it('filters by slug parameter', () => {
      expect(digestBySlugQuery).toContain('slug.current == $slug')
    })
  })

  describe('allDigestSlugsQuery', () => {
    it('only includes published digests', () => {
      expect(allDigestSlugsQuery).toContain('status == "published"')
    })
  })

  describe('activeSourcesQuery', () => {
    it('filters for active RSS sources', () => {
      expect(activeSourcesQuery).toContain('active == true')
      expect(activeSourcesQuery).toContain('type == "rss"')
    })

    it('returns required fields', () => {
      expect(activeSourcesQuery).toContain('_id')
      expect(activeSourcesQuery).toContain('name')
      expect(activeSourcesQuery).toContain('url')
    })
  })
})

import { describe, it, expect } from 'vitest'
import { extractKeywords, slugify } from '@/lib/text-utils'

describe('extractKeywords', () => {
  it('extracts meaningful words from a headline', () => {
    const result = extractKeywords('Apple Releases New AI Chip for Developers')
    expect(result).toContain('apple')
    expect(result).toContain('releases')
    expect(result).toContain('chip')
    expect(result).toContain('developers')
  })

  it('removes stop words', () => {
    const result = extractKeywords('The Future of AI is Now')
    expect(result).not.toContain('the')
    expect(result).not.toContain('of')
    expect(result).not.toContain('is')
    expect(result).not.toContain('now')
    expect(result).toContain('future')
  })

  it('removes short words', () => {
    const result = extractKeywords('AI is an ML tool')
    expect(result).not.toContain('ai')
    expect(result).not.toContain('an')
    expect(result).not.toContain('ml')
    expect(result).toContain('tool')
  })

  it('handles empty input', () => {
    expect(extractKeywords('')).toEqual([])
  })

  it('strips special characters', () => {
    const result = extractKeywords("Google's Cloud Platform: 2024 Update!")
    expect(result).toContain('googles')
    expect(result).toContain('cloud')
    expect(result).toContain('platform')
    expect(result).toContain('update')
  })
})

describe('slugify for trend radar', () => {
  it('generates consistent slugs for trend radar titles', () => {
    expect(slugify('Trend Radar — 2024-06-15')).toBe('trend-radar-2024-06-15')
  })

  it('handles special characters in titles', () => {
    expect(slugify("What's Next for AI & ML?")).toBe('what-s-next-for-ai-ml')
  })
})

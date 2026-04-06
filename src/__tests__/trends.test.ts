import { describe, it, expect } from 'vitest'

// Test the keyword extraction and scoring logic from the trends route

function extractKeywords(headline: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
    'once', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both',
    'either', 'neither', 'each', 'every', 'all', 'any', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than',
    'too', 'very', 'just', 'because', 'how', 'what', 'which', 'who',
    'when', 'where', 'why', 'this', 'that', 'these', 'those', 'it', 'its',
    'new', 'says', 'said', 'also', 'get', 'gets', 'got', 'like', 'make',
    'makes', 'made', 'first', 'now', 'way', 'may', 'many', 'much',
  ])

  return headline
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
}

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

describe('articleToPortableText logic', () => {
  // Test the slugify function used in both trends and draft routes
  function slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 96)
  }

  it('generates consistent slugs for trend radar titles', () => {
    expect(slugify('Trend Radar — 2024-06-15')).toBe('trend-radar-2024-06-15')
  })

  it('handles special characters in titles', () => {
    expect(slugify("What's Next for AI & ML?")).toBe('what-s-next-for-ai-ml')
  })
})

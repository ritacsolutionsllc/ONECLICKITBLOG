const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'is','are','was','were','be','been','being','have','has','had','do',
  'does','did','will','would','could','should','may','might','that','this',
  'it','its','by','from','as','into','through','during','new','latest',
  'says','said','report','reports','update','updates','news','week','day',
  'year','now','how','what','why','when','who','which','more','all','can',
  'after','before','via','over','about','gets','get','top','best','first',
  'next','major','big','set','not','just','than','use','using','used','your',
  'our','you','we','they','their','here','there','amid','despite','inside',
  'still','here','some','into','also','back','even','most','other','time',
])

export interface TrendKeyword {
  keyword: string
  count: number
  momentum: 'rising' | 'stable' | 'declining'
}

/**
 * Extract trending unigrams and bigrams from a list of headlines.
 * Returns the top N by frequency, classified by momentum.
 */
export function extractKeywords(headlines: string[], topN = 20): TrendKeyword[] {
  const freq = new Map<string, number>()

  for (const headline of headlines) {
    const words = headline
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOPWORDS.has(w))

    for (let i = 0; i < words.length; i++) {
      const w = words[i]
      freq.set(w, (freq.get(w) ?? 0) + 1)

      // Bigrams
      if (i < words.length - 1) {
        const next = words[i + 1]
        if (!STOPWORDS.has(next)) {
          const bigram = `${w} ${next}`
          freq.set(bigram, (freq.get(bigram) ?? 0) + 1)
        }
      }
    }
  }

  return Array.from(freq.entries())
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([keyword, count]) => ({
      keyword,
      count,
      momentum:
        count >= 8 ? 'rising' : count >= 4 ? 'stable' : 'declining',
    }))
}

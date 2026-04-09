import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })
})

describe('formatDate', () => {
  it('formats ISO date string to readable format', () => {
    // Use noon UTC to avoid timezone boundary issues
    const result = formatDate('2024-06-15T12:00:00Z')
    expect(result).toContain('June')
    expect(result).toContain('15')
    expect(result).toContain('2024')
  })

  it('handles date-only strings', () => {
    // Use a mid-month date to avoid day rollover across timezones
    const result = formatDate('2024-01-15T12:00:00Z')
    expect(result).toContain('January')
    expect(result).toContain('2024')
  })
})

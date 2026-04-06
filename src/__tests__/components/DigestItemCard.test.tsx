import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { DigestItemCard } from '@/components/blog/DigestItemCard'
import type { DigestItem } from '@/types/sanity'

afterEach(cleanup)

describe('DigestItemCard', () => {
  const baseItem: DigestItem = {
    headline: 'Test Headline',
  }

  it('renders the headline', () => {
    render(<DigestItemCard item={baseItem} />)
    expect(screen.getByText('Test Headline')).toBeInTheDocument()
  })

  it('renders headline as a link when sourceUrl is provided', () => {
    const item: DigestItem = {
      ...baseItem,
      sourceUrl: 'https://example.com/article',
    }
    render(<DigestItemCard item={item} />)
    const link = screen.getByRole('link', { name: 'Test Headline' })
    expect(link).toHaveAttribute('href', 'https://example.com/article')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders headline as plain text when no sourceUrl', () => {
    render(<DigestItemCard item={baseItem} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders source name when provided', () => {
    const item: DigestItem = {
      ...baseItem,
      source: { name: 'TechCrunch', slug: 'techcrunch' },
    }
    render(<DigestItemCard item={item} />)
    expect(screen.getByText(/via/)).toBeInTheDocument()
    expect(screen.getByText(/TechCrunch/)).toBeInTheDocument()
  })

  it('renders summary when provided', () => {
    const item: DigestItem = {
      ...baseItem,
      summary: 'This is a test summary.',
    }
    render(<DigestItemCard item={item} />)
    expect(screen.getByText('This is a test summary.')).toBeInTheDocument()
  })

  it('renders AI take when provided', () => {
    const item: DigestItem = {
      ...baseItem,
      aiTake: 'This is significant because...',
    }
    render(<DigestItemCard item={item} />)
    expect(screen.getByText(/This is significant because/)).toBeInTheDocument()
    expect(screen.getByText('AI Take:')).toBeInTheDocument()
  })

  it('does not render source or AI take when not provided', () => {
    render(<DigestItemCard item={baseItem} />)
    expect(screen.queryByText(/via/)).not.toBeInTheDocument()
    expect(screen.queryByText('AI Take:')).not.toBeInTheDocument()
  })
})

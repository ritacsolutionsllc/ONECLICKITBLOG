import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsletterCta } from '@/components/cta/NewsletterCta'

afterEach(cleanup)

describe('NewsletterCta', () => {
  it('renders the heading and form', () => {
    render(<NewsletterCta endpoint="https://api.example.com/subscribe" />)
    expect(screen.getByText('Stay in the loop')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('renders without endpoint prop', () => {
    render(<NewsletterCta />)
    expect(screen.getByText('Stay in the loop')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('does not submit when no endpoint is configured', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    render(<NewsletterCta />)
    const input = screen.getByPlaceholderText('you@example.com')
    const button = screen.getByRole('button', { name: 'Subscribe' })

    await user.type(input, 'test@example.com')
    await user.click(button)

    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })

  it('submits email when endpoint is configured', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 }),
    )

    render(<NewsletterCta endpoint="https://api.example.com/subscribe" />)
    const input = screen.getByPlaceholderText('you@example.com')
    const button = screen.getByRole('button', { name: 'Subscribe' })

    await user.type(input, 'test@example.com')
    await user.click(button)

    expect(fetchSpy).toHaveBeenCalledWith('https://api.example.com/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    })

    expect(await screen.findByText('Thanks for subscribing!')).toBeInTheDocument()
    fetchSpy.mockRestore()
  })

  it('shows error state on failed submission', async () => {
    const user = userEvent.setup()
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 500 }),
    )

    render(<NewsletterCta endpoint="https://api.example.com/subscribe" />)
    const input = screen.getByPlaceholderText('you@example.com')
    const button = screen.getByRole('button', { name: 'Subscribe' })

    await user.type(input, 'test@example.com')
    await user.click(button)

    expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument()
    fetchSpy.mockRestore()
  })
})

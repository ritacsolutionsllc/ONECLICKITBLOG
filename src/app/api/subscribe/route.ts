import { type NextRequest, NextResponse } from 'next/server'
import { getWriteClient } from '@/lib/ingestion/sanity-write-client'
import { groq } from 'next-sanity'

// Simple in-memory rate limit (replace with @upstash/ratelimit for production)
const subscribeAttempts = new Map<string, { count: number; resetAt: number }>();

function checkSubscribeRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = subscribeAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    subscribeAttempts.set(ip, { count: 1, resetAt: now + 3600_000 }); // 1 hour window
    return true;
  }
  if (entry.count >= 3) return false; // max 3 subscribe attempts per hour per IP
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (!checkSubscribeRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many subscription attempts. Please try again later.' }, { status: 429 });
  }

  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const client = getWriteClient()

    // Check if already subscribed
    const existing = await client.fetch(
      groq`*[_type == "subscriber" && email == $email][0]{ _id, status }`,
      { email: normalizedEmail },
    )

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Re-activate
        await client.patch(existing._id).set({ status: 'active' }).commit()
        return NextResponse.json({ success: true, message: 'Welcome back!' })
      }
      return NextResponse.json({ success: true, message: 'Already subscribed' })
    }

    // Create new subscriber
    await client.create({
      _type: 'subscriber',
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    })

    return NextResponse.json({ success: true, message: 'Subscribed!' })
  } catch (err) {
    console.error('Subscribe error:', err)
    const message = err instanceof Error ? err.message : 'Subscription failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { revalidateSecret } from '@/sanity/env'
import { tagsByType } from '@/lib/revalidation-tags'

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current?: string }
    }>(req, revalidateSecret)

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 })
    }

    const tags = tagsByType[body._type] || []
    for (const tag of tags) {
      revalidateTag(tag)
    }

    return NextResponse.json({
      revalidated: true,
      tags,
      type: body._type,
    })
  } catch (err) {
    console.error('Revalidation error:', err)
    return new NextResponse('Internal error', { status: 500 })
  }
}

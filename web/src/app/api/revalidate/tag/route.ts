import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

interface WebhookPayload {
  tags?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      request,
      process.env.SANITY_REVALIDATE_SECRET,
      // The delay lets the Sanity CDN catch up before we refetch.
      true,
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!Array.isArray(body?.tags) || body.tags.length === 0) {
      return new Response('Missing tags', { status: 400 })
    }

    // Next 16 requires a cacheLife profile. "max" purges every cached entry for the
    // tag, which is what a CMS publish means. updateTag is Server Actions only.
    body.tags.forEach((tag) => revalidateTag(tag, 'max'))
    return NextResponse.json({ revalidated: body.tags })
  } catch (error) {
    return new Response((error as Error).message, { status: 500 })
  }
}

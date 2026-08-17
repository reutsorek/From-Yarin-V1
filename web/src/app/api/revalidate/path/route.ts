import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

interface WebhookPayload {
  path?: string
}

export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      request,
      process.env.SANITY_REVALIDATE_SECRET,
      true,
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?.path) {
      return new Response('Missing path', { status: 400 })
    }

    revalidatePath(body.path)
    return NextResponse.json({ revalidated: body.path })
  } catch (error) {
    return new Response((error as Error).message, { status: 500 })
  }
}

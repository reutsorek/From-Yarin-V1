import { NextResponse, type NextRequest } from 'next/server'
import { deckHtml } from './deck-html'

export const dynamic = 'force-dynamic'

function unauthorized(): NextResponse {
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Extreme Environments Sprint", charset="UTF-8"' },
  })
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.EXPEDITION_DECK_PASSWORD
  if (!expected) return unauthorized()

  const header = request.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return unauthorized()

  const decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString('utf8')
  const password = decoded.includes(':') ? decoded.slice(decoded.indexOf(':') + 1) : decoded
  if (password !== expected) return unauthorized()

  return new NextResponse(deckHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  })
}

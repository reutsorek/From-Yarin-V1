import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  message: z.string().min(1).max(5000),
  // Honeypot. Real people never see this field, so a value means a bot.
  company: z.string().max(0).optional(),
})

/**
 * In-memory limiter. It resets on every cold start and is not shared between
 * instances, which is fine for a contact form. Swap the two functions below for
 * a shared store if you need real guarantees.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(key: string): boolean {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const parsed = schema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }

  if (parsed.data.company) {
    // Answer as if it worked so the bot does not learn anything.
    return NextResponse.json({ ok: true })
  }

  // Wire this to your inbox, CRM, or Slack. Left unimplemented on purpose.
  console.info('[contact] submission', {
    name: parsed.data.name,
    email: parsed.data.email,
  })

  return NextResponse.json({ ok: true })
}

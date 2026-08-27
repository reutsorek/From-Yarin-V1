import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { writeClient } from '@/sanity/lib/writeClient'

const INTEREST_TYPES = [
  'sprint',
  'signature',
  'research',
  'advisory',
  'speaking',
  'media',
  'other',
] as const

const schema = z.object({
  fullName: z.string().min(1).max(120),
  organization: z.string().max(200).optional(),
  roleTitle: z.string().max(200).optional(),
  email: z.email(),
  phone: z.string().max(50).optional(),
  countryRegion: z.string().max(120).optional(),
  interestType: z.enum(INTEREST_TYPES).optional(),
  preferredTiming: z.string().max(200).optional(),
  budgetRange: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
  privacyConsent: z.literal(true),
  turnstileToken: z.string().min(1),
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

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return false

  const body = new URLSearchParams({ secret, response: token, remoteip: ip })
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  }).catch(() => null)

  if (!response?.ok) return false
  const result = (await response.json().catch(() => null)) as { success?: boolean } | null
  return result?.success === true
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

  const captchaVerified = await verifyTurnstile(parsed.data.turnstileToken, ip)
  if (!captchaVerified) {
    return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 })
  }

  await writeClient.create({
    _type: 'inquiry',
    fullName: parsed.data.fullName,
    organization: parsed.data.organization || undefined,
    roleTitle: parsed.data.roleTitle || undefined,
    email: parsed.data.email,
    phone: parsed.data.phone || undefined,
    countryRegion: parsed.data.countryRegion || undefined,
    interestType: parsed.data.interestType,
    preferredTiming: parsed.data.preferredTiming || undefined,
    budgetRange: parsed.data.budgetRange || undefined,
    message: parsed.data.message,
    privacyConsent: parsed.data.privacyConsent,
    captchaVerified,
    createdAt: new Date().toISOString(),
    status: 'new',
  })

  return NextResponse.json({ ok: true })
}

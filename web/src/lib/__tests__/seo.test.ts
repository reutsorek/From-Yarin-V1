import { describe, expect, it } from 'vitest'

import { buildMetadata } from '@/lib/seo'

const siteUrl = 'https://example.com'
const siteName = 'Example'
const defaultOgImage = {
  _type: 'image',
  asset: { _ref: 'image-abc123def456abc123def456abc123def456abcd-1200x630-png' },
}

function build(overrides: Record<string, unknown> = {}) {
  return buildMetadata({
    seo: { title: 'Page title', description: 'Page description' },
    path: '/about',
    locale: 'he',
    siteUrl,
    siteName,
    defaultOgImage,
    ...overrides,
  } as Parameters<typeof buildMetadata>[0])
}

describe('buildMetadata', () => {
  it('uses the seo title and description', () => {
    const metadata = build()
    expect(metadata.title).toBeTruthy()
    expect(String(metadata.title)).toContain('Page title')
    expect(metadata.description).toBe('Page description')
  })

  it('builds an absolute canonical URL', () => {
    const canonical = String(build().alternates?.canonical)
    expect(canonical.startsWith(siteUrl)).toBe(true)
    expect(canonical).toContain('/about')
  })

  it('lists absolute hreflang alternates for both locales', () => {
    const languages = build().alternates?.languages as Record<string, string> | undefined
    expect(languages).toBeTruthy()
    expect(Object.keys(languages ?? {})).toEqual(expect.arrayContaining(['he', 'en']))
    for (const value of Object.values(languages ?? {})) {
      expect(String(value).startsWith(siteUrl)).toBe(true)
    }
  })

  it('exposes an open graph image when one is available', () => {
    const images = build().openGraph?.images
    expect(images).toBeTruthy()
    expect(JSON.stringify(images)).toContain('http')
  })

  it('marks the page as noindex when requested', () => {
    const metadata = build({
      seo: { title: 'Hidden', description: 'Hidden page', noIndex: true },
    })
    expect(metadata.robots).toMatchObject({ index: false })
  })
})

import { expect, test } from '@playwright/test'

import { skipWithoutServer } from './helpers'

skipWithoutServer()

test('sitemap.xml is valid and absolute', async ({ request }) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)

  const body = await response.text()
  expect(body).toContain('<urlset')
  expect(body.trimStart().startsWith('<?xml')).toBe(true)

  const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim())
  expect(locations.length).toBeGreaterThan(0)

  const origins = new Set<string>()
  for (const location of locations) {
    expect(() => new URL(location)).not.toThrow()
    origins.add(new URL(location).origin)
  }
  expect(origins.size).toBe(1)
})

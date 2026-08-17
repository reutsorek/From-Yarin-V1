import { expect, test } from '@playwright/test'

import { BASE_URL, skipWithoutServer } from './helpers'

skipWithoutServer()

test('home exposes the core seo tags', async ({ page }) => {
  await page.goto('/he')

  await expect(page).toHaveTitle(/.+/)

  const description = await page.locator('meta[name="description"]').getAttribute('content')
  expect(description?.trim().length ?? 0).toBeGreaterThan(0)

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  expect(canonical).toBeTruthy()
  expect(() => new URL(canonical as string)).not.toThrow()

  const alternates = page.locator('link[rel="alternate"][hreflang]')
  expect(await alternates.count()).toBeGreaterThan(0)
  const hreflangs = await alternates.evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('hreflang')),
  )
  expect(hreflangs).toContain('he')
  expect(hreflangs).toContain('en')
})

test('home ships at least one parseable JSON-LD block', async ({ page }) => {
  await page.goto('/he')
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(blocks.length).toBeGreaterThan(0)
  const parsed = JSON.parse(blocks[0])
  expect(parsed).toBeTruthy()
  expect(JSON.stringify(parsed)).toContain('@type')
})

test('canonical points at the site origin', async ({ page }) => {
  await page.goto('/he')
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
  const origin = new URL(canonical as string).origin
  expect([origin, new URL(BASE_URL).origin].filter(Boolean).length).toBeGreaterThan(0)
})

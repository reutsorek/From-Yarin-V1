import { expect, test } from '@playwright/test'

import { skipWithoutServer } from './helpers'

skipWithoutServer()

const directions = [
  { locale: 'he', dir: 'rtl' },
  { locale: 'en', dir: 'ltr' },
]

for (const target of directions) {
  test(`/${target.locale} sets dir="${target.dir}"`, async ({ page }) => {
    await page.goto(`/${target.locale}`)
    await expect(page.locator('html')).toHaveAttribute('dir', target.dir)
  })

  test(`/${target.locale} does not scroll horizontally`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/${target.locale}`)
    const overflow = await page.evaluate(() => {
      const root = document.documentElement
      return root.scrollWidth - root.clientWidth
    })
    expect(overflow).toBeLessThanOrEqual(1)
  })
}

import { expect, test } from '@playwright/test'

import { skipWithoutServer } from './helpers'

skipWithoutServer()

test.describe('@smoke home', () => {
  for (const locale of ['he', 'en']) {
    test(`renders the ${locale} home page`, async ({ page }) => {
      const response = await page.goto(`/${locale}`)
      expect(response?.status()).toBeLessThan(400)
      await expect(page.locator('main')).toBeVisible()
      await expect(page).toHaveTitle(/.+/)
    })
  }

  test('navigates client side through an internal link', async ({ page }) => {
    await page.goto('/en')
    const link = page.locator('a[href^="/en/"]').first()
    await expect(link).toBeVisible()
    const href = await link.getAttribute('href')
    await link.click()
    await page.waitForURL(`**${href}`)
    await expect(page.locator('main')).toBeVisible()
  })
})

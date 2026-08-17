import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { skipWithoutServer } from './helpers'

skipWithoutServer()

const pages = [
  { name: 'home', path: '/he' },
  { name: 'blog', path: '/he/blog' },
]

for (const target of pages) {
  test(`${target.name} has no wcag2a or wcag2aa violations`, async ({ page }) => {
    await page.goto(target.path)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(results.violations.map((violation) => violation.id)).toEqual([])
  })
}

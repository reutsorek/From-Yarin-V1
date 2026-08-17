import { defineConfig, devices } from '@playwright/test'

// localhost, not 127.0.0.1: the Next 16 HMR websocket rejects the raw IP origin.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    testIdAttribute: 'data-testid',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

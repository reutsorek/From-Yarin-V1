import { test } from '@playwright/test'

export const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

let reachable: boolean | null = null

export async function serverIsUp(): Promise<boolean> {
  if (reachable !== null) return reachable
  try {
    const response = await fetch(BASE_URL, { redirect: 'manual' })
    reachable = response.status < 500
  } catch {
    reachable = false
  }
  return reachable
}

export function skipWithoutServer() {
  test.beforeEach(async () => {
    const up = await serverIsUp()
    test.skip(
      !up,
      `No server reachable at ${BASE_URL}. Run npm run build -w web then npm run start.`,
    )
  })
}

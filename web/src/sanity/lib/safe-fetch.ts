import { freshClient } from './client'

/**
 * Build-time reads only. A broken or unreachable dataset must not fail the build:
 * returning the fallback leaves the affected routes to render on demand instead.
 */
export async function safeFetch<T>(
  label: string,
  run: (client: typeof freshClient) => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await run(freshClient)
  } catch (error) {
    console.warn(`[sanity] ${label} failed, continuing without it:`, (error as Error).message)
    return fallback
  }
}

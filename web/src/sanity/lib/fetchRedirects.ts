import type { Redirect } from 'next/dist/lib/load-custom-routes'
import { REDIRECTS_QUERY } from '../queries'
import { safeFetch } from './safe-fetch'

/**
 * Redirects come from the CMS so a marketing rename does not need a code change.
 * Vercel caps next.config redirects at 1024; past that, move this to middleware.
 */
export async function fetchRedirects(): Promise<Redirect[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []

  const rows = await safeFetch('redirects', (client) => client.fetch(REDIRECTS_QUERY), [])

  return rows
    .filter((row): row is { source: string; destination: string; permanent: boolean | null } =>
      Boolean(row.source && row.destination),
    )
    .map((row) => ({
      source: row.source,
      destination: row.destination,
      permanent: row.permanent !== false,
    }))
}

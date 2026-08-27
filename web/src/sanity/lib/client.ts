import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'
import { env } from '../../lib/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? 'http://localhost:3333',
  },
})

/** Uncached client for build-time reads (generateStaticParams, sitemap) and webhooks. */
export const freshClient = client.withConfig({ useCdn: false })

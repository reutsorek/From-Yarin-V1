import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/** Uncached client for build-time reads (generateStaticParams, sitemap) and webhooks. */
export const freshClient = client.withConfig({ useCdn: false })

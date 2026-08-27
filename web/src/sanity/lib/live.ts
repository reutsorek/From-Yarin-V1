import { defineLive } from 'next-sanity/live'
import { client } from './client'

const token = process.env.SANITY_API_READ_TOKEN

if (!token) {
  throw new Error(
    'Missing SANITY_API_READ_TOKEN. Create a Viewer token in the Sanity dashboard and add it to .env.local.',
  )
}

/**
 * browserToken (standalone Live Draft Content preview, outside Presentation) requires a
 * configured Studio URL. This project's Studio is not deployed to a public URL yet, so only
 * serverToken is set; draft mode preview inside Presentation still works without it.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
})

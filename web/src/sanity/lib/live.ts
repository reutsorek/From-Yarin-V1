import { defineLive } from 'next-sanity/live'
import { client } from './client'

const token = process.env.SANITY_API_READ_TOKEN

if (!token) {
  throw new Error(
    'Missing SANITY_API_READ_TOKEN. Create a Viewer token in the Sanity dashboard and add it to .env.local.',
  )
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})

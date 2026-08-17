import 'server-only'

export const token = process.env.SANITY_API_READ_TOKEN

if (!token) {
  throw new Error(
    'Missing SANITY_API_READ_TOKEN. Create a Viewer token in the Sanity dashboard and add it to .env.local.',
  )
}

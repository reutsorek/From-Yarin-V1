import 'server-only'

export const writeToken = process.env.SANITY_API_WRITE_TOKEN

if (!writeToken) {
  throw new Error(
    'Missing SANITY_API_WRITE_TOKEN. Create an Editor token in the Sanity dashboard (manage.sanity.io) and add it to .env.local. Used only by the contact API route to store inquiries.',
  )
}

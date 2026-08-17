import { z } from 'zod'

/**
 * Validated once at module load so a misconfigured deploy fails at boot with a
 * readable message instead of at the first request with an undefined project id.
 */
const schema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1, 'Set NEXT_PUBLIC_SANITY_PROJECT_ID'),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1, 'Set NEXT_PUBLIC_SANITY_DATASET'),
  NEXT_PUBLIC_SITE_URL: z.url('Set NEXT_PUBLIC_SITE_URL to an absolute URL'),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
})

const parsed = schema.safeParse({
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
  throw new Error(
    `Invalid environment.\n${issues.join('\n')}\n\nCopy .env.example to .env.local and run "npm run init".`,
  )
}

export const env = parsed.data

export const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')

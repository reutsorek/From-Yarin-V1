function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local at the repo root and fill it in, or run "npm run init".`,
    )
  }
  return value
}

export const projectId = required(
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
)

export const dataset = required(
  'NEXT_PUBLIC_SANITY_DATASET',
  process.env.NEXT_PUBLIC_SANITY_DATASET,
)

/**
 * One API version for the whole app. Bumping it is a deliberate, reviewed change,
 * never something that drifts between two clients.
 */
export const apiVersion = '2026-08-16'

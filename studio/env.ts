function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to studio/.env and fill it in, or run "npm run init".`,
    )
  }
  return value
}

export const projectId = required('SANITY_STUDIO_PROJECT_ID', process.env.SANITY_STUDIO_PROJECT_ID)

export const dataset = required('SANITY_STUDIO_DATASET', process.env.SANITY_STUDIO_DATASET)

export const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? 'http://localhost:3000'

/** Locales the Studio offers for document-level translation. Keep in sync with web/src/i18n/routing.ts. */
export const supportedLanguages = [
  { id: 'he', title: 'עברית' },
  { id: 'en', title: 'English' },
] as const

export const defaultLanguage = supportedLanguages[0].id

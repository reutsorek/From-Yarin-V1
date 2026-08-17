import { defineRouting } from 'next-intl/routing'

export const locales = ['he', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'he'

/** Direction lives in one map. Never branch on the locale string at a call site. */
export const DIRECTIONS: Record<Locale, 'rtl' | 'ltr'> = {
  he: 'rtl',
  en: 'ltr',
}

export const LOCALE_LABELS: Record<Locale, string> = {
  he: 'עברית',
  en: 'English',
}

/** OpenGraph locale tags, used by buildMetadata. */
export const OG_LOCALES: Record<Locale, string> = {
  he: 'he_IL',
  en: 'en_US',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Prefixing every locale, including the default, avoids the duplicate-content
  // and canonical edge cases you get when the default sits at the root.
  localePrefix: 'always',
})

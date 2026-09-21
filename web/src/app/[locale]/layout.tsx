import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { stegaClean } from 'next-sanity'
import { Rubik } from 'next/font/google'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { VisualEditing } from 'next-sanity/visual-editing'
import type { ReactNode } from 'react'
import type { Organization, WithContext } from 'schema-dts'

import { DisableDraftMode } from '@/components/disable-draft-mode'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { JsonLd } from '@/components/json-ld'
import { DIRECTIONS, locales, routing, type Locale } from '@/i18n/routing'
import { siteUrl } from '@/lib/env'
import { siteTitle } from '@/lib/seo'
import { urlFor } from '@/sanity/lib/image'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { NAVIGATION_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'

/** No weight array: Rubik is variable, and pinning weights ships faux bold. */
const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  variable: '--font-hebrew',
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false })
  const description = (locale === 'he' ? settings?.descriptionHe : null) || settings?.description
  const title = siteTitle(settings, locale)

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title ?? '',
      template: title ? `%s | ${title}` : '%s',
    },
    description: description ?? undefined,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const t = await getTranslations('nav')
  const [{ data: settings }, { data: navigation }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: NAVIGATION_QUERY }),
  ])

  const isDraft = (await draftMode()).isEnabled

  const orgDescription = (locale === 'he' ? settings?.descriptionHe : null) || settings?.description
  const organizationJsonLd: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: stegaClean(siteTitle(settings, locale as Locale)) || undefined,
    url: siteUrl,
    logo: settings?.logo?.asset ? urlFor(settings.logo).width(512).url() : undefined,
    description: stegaClean(orgDescription) || undefined,
    sameAs: settings?.socials?.map((social) => social.url).filter((url) => Boolean(url)) as
      string[] | undefined,
  }

  return (
    <html lang={locale} dir={DIRECTIONS[locale as Locale]} className={rubik.variable}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={organizationJsonLd} />
        <NextIntlClientProvider>
          <a
            href="#main"
            className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:px-4 focus:py-2"
          >
            {t('skipToContent')}
          </a>
          <Header navigation={navigation} siteSettings={settings} locale={locale as Locale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer navigation={navigation} siteSettings={settings} locale={locale as Locale} />
        </NextIntlClientProvider>
        <SanityLive />
        {isDraft ? (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        ) : null}
        {settings?.analytics?.gaMeasurementId ? (
          <GoogleAnalytics gaId={settings.analytics.gaMeasurementId} />
        ) : null}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import { Section, SectionHeader } from '@/components/primitives/section'
import { SanityImage } from '@/components/sanity-image'
import { ROUTES } from '@/config/urls'
import type { Locale } from '@/i18n/routing'
import { siteUrl } from '@/lib/env'
import { buildMetadata } from '@/lib/seo'
import { sanityFetch } from '@/sanity/lib/live'
import { POSTS_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'

interface Props {
  params: Promise<{ locale: Locale }>
}

const PAGE_SIZE = 24

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY, stega: false })

  return buildMetadata({
    seo: { title: t('title'), description: settings?.description },
    path: '/blog',
    locale,
    siteUrl,
    siteName: settings?.title,
    defaultOgImage: settings?.defaultOgImage,
  })
}

export default async function BlogIndex({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('blog')
  const { data: posts } = await sanityFetch({
    query: POSTS_QUERY,
    params: { locale, start: 0, end: PAGE_SIZE },
  })

  return (
    <Section>
      <SectionHeader level={2} heading={t('title')} />
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post._id} className="group">
            <Link href={ROUTES.post(locale, post.slug ?? '')} className="block">
              {post.coverImage ? (
                <SanityImage
                  image={post.coverImage}
                  width={640}
                  height={400}
                  sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
                  className="aspect-[8/5] w-full rounded-lg object-cover"
                />
              ) : (
                <div className="bg-muted aspect-[8/5] w-full rounded-lg" />
              )}
              <h3 className="group-hover:text-primary-ink mt-4 text-lg font-semibold">
                {post.title}
              </h3>
              {post.excerpt ? (
                <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">{post.excerpt}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}

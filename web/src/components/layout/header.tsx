import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/config/urls'
import { SanityImage } from '@/components/sanity-image'
import type { NavigationValue, SiteSettingsValue } from '@/components/blocks/types'
import { NavLink } from './nav-link'
import { MobileNav } from './mobile-nav'
import { LocaleSwitcher } from './locale-switcher'

export interface HeaderProps {
  navigation: NavigationValue | null | undefined
  siteSettings: SiteSettingsValue | null | undefined
  locale: string
  locales?: readonly string[]
}

export async function Header({ navigation, siteSettings, locale, locales = [] }: HeaderProps) {
  const t = await getTranslations('nav')
  const links = navigation?.headerLinks ?? []

  return (
    <header className="border-border bg-background/90 sticky top-0 z-40 w-full border-b backdrop-blur">
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2"
      >
        {t('skipToContent')}
      </a>

      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.home(locale)}
          className="text-foreground flex shrink-0 items-center gap-2 font-semibold"
        >
          {siteSettings?.logo?.asset ? (
            <SanityImage
              image={siteSettings.logo}
              width={160}
              sizes="160px"
              priority
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="text-lg tracking-tight">{siteSettings?.title}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link._key}
              link={link}
              locale={locale}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            />
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LocaleSwitcher locale={locale} locales={locales} className="hidden sm:inline-flex" />
          <MobileNav links={links} locale={locale}>
            <LocaleSwitcher locale={locale} locales={locales} className="sm:hidden" />
          </MobileNav>
        </div>
      </div>
    </header>
  )
}

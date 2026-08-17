import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/config/urls'
import { SanityImage } from '@/components/sanity-image'
import { Separator } from '@/components/ui/separator'
import type { NavigationValue, SiteSettingsValue } from '@/components/blocks/types'
import { NavLink } from './nav-link'

const socialIcons: Record<string, LucideIcon> = {
  facebook: Facebook,
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
}

export interface FooterProps {
  navigation: NavigationValue | null | undefined
  siteSettings: SiteSettingsValue | null | undefined
  locale: string
}

export function Footer({ navigation, siteSettings, locale }: FooterProps) {
  const groups = navigation?.footerGroups ?? []
  const socials = siteSettings?.socials ?? []

  return (
    <footer className="border-border bg-muted w-full border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link
              href={ROUTES.home(locale)}
              className="text-foreground flex items-center gap-2 font-semibold"
            >
              {siteSettings?.logo?.asset ? (
                <SanityImage
                  image={siteSettings.logo}
                  width={160}
                  sizes="160px"
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="text-lg tracking-tight">{siteSettings?.title}</span>
              )}
            </Link>
            {siteSettings?.description ? (
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed text-pretty">
                {siteSettings.description}
              </p>
            ) : null}
          </div>

          {groups.length > 0 ? (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
              {groups.map((group) => (
                <div key={group._key} className="flex flex-col gap-4 text-start">
                  {group.title ? (
                    <h2 className="text-foreground text-sm font-semibold">{group.title}</h2>
                  ) : null}
                  <ul className="flex flex-col gap-3">
                    {(group.links ?? []).map((link) => (
                      <li key={link._key}>
                        <NavLink
                          link={link}
                          locale={locale}
                          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {navigation?.footerNote ? (
            <p className="text-muted-foreground text-center text-sm sm:text-start">
              {navigation.footerNote}
            </p>
          ) : (
            <span />
          )}

          {socials.length > 0 ? (
            <ul className="flex items-center gap-2">
              {socials.map((social) => {
                if (!social.url) return null
                const Icon = socialIcons[(social.platform ?? '').toLowerCase()] ?? LinkIcon

                return (
                  <li key={social._key}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform ?? social.url}
                      className="text-muted-foreground hover:bg-background hover:text-foreground flex size-9 items-center justify-center rounded-lg transition-colors"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  )
}

'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { locales, LOCALE_LABELS } from '@/i18n/routing'
import { cn } from '@/lib/cn'

export interface LocaleSwitcherProps {
  locale: string
  className?: string
}

/**
 * Two text links, each the target locale's own name, that swap the locale on the
 * current path. The path comes from next-intl's `usePathname`, so it is already
 * locale stripped and the `<Link>` re-adds the target prefix.
 */
export function LocaleSwitcher({ locale, className }: LocaleSwitcherProps) {
  const t = useTranslations('localeSwitcher')
  const pathname = usePathname()

  if (locales.length < 2) return null

  return (
    <div className={cn('flex items-center gap-2 text-sm font-medium', className)}>
      {locales.map((value, index) => {
        const active = value === locale
        return (
          <React.Fragment key={value}>
            {index > 0 ? (
              <span aria-hidden className="text-muted-foreground/50">
                /
              </span>
            ) : null}
            <Link
              href={pathname}
              locale={value}
              hrefLang={value}
              aria-label={t('switchTo', { language: LOCALE_LABELS[value] })}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'focus-visible:ring-ring rounded-md px-1 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none',
                active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {LOCALE_LABELS[value]}
            </Link>
          </React.Fragment>
        )
      })}
    </div>
  )
}

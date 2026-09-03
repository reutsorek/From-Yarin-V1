'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { locales, LOCALE_LABELS, type Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

export interface LocaleFlagsProps {
  locale: string
  className?: string
}

/**
 * Two flag links that swap the locale on the current path. The path comes from
 * next-intl's `usePathname`, so it is already locale stripped and the `<Link>`
 * re-adds the target prefix. Both flags share one 30x20 viewBox and render into
 * an identical framed box, so they always match in size. National flag colors
 * are baked into the SVG markup, they are artwork rather than theme styling.
 */
export function LocaleFlags({ locale, className }: LocaleFlagsProps) {
  const t = useTranslations('localeSwitcher')
  const pathname = usePathname()

  if (locales.length < 2) return null

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {locales.map((value) => {
        const Flag = FLAGS[value]
        const active = value === locale
        return (
          <Link
            key={value}
            href={pathname}
            locale={value}
            hrefLang={value}
            aria-label={t('switchTo', { language: LOCALE_LABELS[value] })}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-md transition-opacity focus-visible:ring-2 focus-visible:outline-none',
              active ? 'opacity-100' : 'hover:bg-muted opacity-45 hover:opacity-90',
            )}
          >
            <span className="ring-border block h-5 w-[30px] shrink-0 overflow-hidden rounded-[3px] shadow-sm ring-1">
              <Flag aria-hidden className="block h-full w-full" />
            </span>
          </Link>
        )
      })}
    </div>
  )
}

const FLAGS: Record<Locale, React.FC<React.SVGProps<SVGSVGElement>>> = {
  he: IsraelFlag,
  en: UnitedStatesFlag,
}

function IsraelFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 30 20"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="30" height="20" fill="#ffffff" />
      <rect y="2.6" width="30" height="3" fill="#0038b8" />
      <rect y="14.4" width="30" height="3" fill="#0038b8" />
      <g fill="none" stroke="#0038b8" strokeWidth="1.2" strokeLinejoin="round">
        <polygon points="15,5.7 11,12.8 19,12.8" />
        <polygon points="15,14.3 11,7.2 19,7.2" />
      </g>
    </svg>
  )
}

const STAR_PATH =
  'M0,-1L0.2245,-0.309 0.9511,-0.309 0.3633,0.118 0.5878,0.809 0,0.382 -0.5878,0.809 -0.3633,0.118 -0.9511,-0.309 -0.2245,-0.309Z'
const STAR_COLUMNS = [2, 5, 8, 11]
const STAR_ROWS = [2.3, 5.4, 8.5]
const STRIPE_HEIGHT = 20 / 13

function UnitedStatesFlag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 30 20"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {Array.from({ length: 13 }, (_, i) => (
        <rect
          key={i}
          y={i * STRIPE_HEIGHT}
          width="30"
          height={STRIPE_HEIGHT + 0.02}
          fill={i % 2 === 0 ? '#d22730' : '#ffffff'}
        />
      ))}
      <rect width="12" height={7 * STRIPE_HEIGHT} fill="#2c3e92" />
      <g fill="#ffffff">
        {STAR_ROWS.flatMap((y) =>
          STAR_COLUMNS.map((x) => (
            <path key={`${x}-${y}`} d={STAR_PATH} transform={`translate(${x} ${y}) scale(1.05)`} />
          )),
        )}
      </g>
    </svg>
  )
}

import { stegaClean } from 'next-sanity'
import * as React from 'react'
import { Link } from '@/i18n/navigation'
import { resolveInternalHref } from '@/config/urls'
import type { ProjectedLink } from '@/components/blocks/types'

export interface NavLinkProps {
  link: ProjectedLink | null | undefined
  locale: string
  className?: string
  onNavigate?: () => void
}

export function NavLink({ link, locale, className, onNavigate }: NavLinkProps) {
  if (!link?.label) return null

  const internalHref =
    stegaClean(link.kind) === 'external' ? null : resolveInternalHref(link.reference, locale)

  if (internalHref) {
    return (
      <Link href={internalHref} className={className} onClick={onNavigate}>
        {link.label}
      </Link>
    )
  }

  const href = link.href
  if (!href) return null

  const isRelative = href.startsWith('/') || href.startsWith('#')

  return (
    <a
      href={href}
      className={className}
      onClick={onNavigate}
      {...(isRelative ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {link.label}
    </a>
  )
}

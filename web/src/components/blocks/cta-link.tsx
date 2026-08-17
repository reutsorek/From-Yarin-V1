import { stegaClean } from 'next-sanity'
import * as React from 'react'
import { Link } from '@/i18n/navigation'
import { Button, type ButtonProps } from '@/components/ui/button'
import { resolveInternalHref } from '@/config/urls'
import type { ProjectedCta } from './types'

const variantMap: Record<string, NonNullable<ButtonProps['variant']>> = {
  primary: 'default',
  default: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  link: 'link',
}

export interface CtaLinkProps {
  cta: Omit<ProjectedCta, '_key'> | null | undefined
  locale: string
  size?: ButtonProps['size']
  className?: string
}

export function CtaLink({ cta, locale, size = 'lg', className }: CtaLinkProps) {
  const link = cta?.link
  if (!link?.label) return null

  const variant = variantMap[stegaClean(cta?.variant) ?? 'primary'] ?? 'default'
  const internalHref =
    stegaClean(link.kind) === 'external' ? null : resolveInternalHref(link.reference, locale)

  if (internalHref) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link href={internalHref}>{link.label}</Link>
      </Button>
    )
  }

  const href = link.href
  if (!href) return null

  const isRelative = href.startsWith('/') || href.startsWith('#')

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={href} {...(isRelative ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>
        {link.label}
      </a>
    </Button>
  )
}

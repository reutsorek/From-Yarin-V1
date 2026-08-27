import { Link } from '@/i18n/navigation'
import { Button, type ButtonProps } from '@/components/ui/button'
import { ROUTES } from '@/config/urls'

export interface InquiryCtaProps {
  label: string | null | undefined
  inquiryType?: string | null
  locale: string
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
  className?: string
}

/**
 * CTAs like "Discuss this format" or "Book a keynote" always resolve to the Contact page
 * with the relevant interest type pre-selected, rather than a generic CMS-picked link.
 */
export function InquiryCta({
  label,
  inquiryType,
  locale,
  size = 'lg',
  variant = 'default',
  className,
}: InquiryCtaProps) {
  if (!label) return null

  const base = ROUTES.page(locale, 'contact')
  const href = inquiryType ? `${base}?interest=${encodeURIComponent(inquiryType)}` : base

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href}>{label}</Link>
    </Button>
  )
}

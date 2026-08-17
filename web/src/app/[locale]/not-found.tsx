import { useLocale, useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/primitives/section'
import { ROUTES } from '@/config/urls'

export default function NotFound() {
  const t = useTranslations('notFound')
  const locale = useLocale()

  return (
    <Section container="narrow">
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
        <p className="text-muted-foreground mt-4">{t('description')}</p>
        <Button asChild className="mt-8">
          <Link href={ROUTES.home(locale)}>{t('backHome')}</Link>
        </Button>
      </div>
    </Section>
  )
}

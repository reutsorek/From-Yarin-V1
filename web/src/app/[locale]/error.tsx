'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/primitives/section'

export default function LocaleError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('common')

  return (
    <Section container="narrow">
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">{t('error')}</h1>
        <Button onClick={reset} variant="outline" className="mt-8">
          {t('retry')}
        </Button>
      </div>
    </Section>
  )
}

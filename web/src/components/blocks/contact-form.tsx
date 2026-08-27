'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Section, SectionHeader } from '@/components/primitives/section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { TurnstileWidget } from '@/components/turnstile-widget'
import { env } from '@/lib/env'
import type { ContactFormBlockValue } from './types'

export type ContactFormBlockProps = ContactFormBlockValue & { locale: string }

type Status = 'idle' | 'pending' | 'success' | 'error' | 'captcha'

const ALL_INTEREST_VALUES = [
  'sprint',
  'signature',
  'research',
  'advisory',
  'speaking',
  'media',
  'other',
] as const

type InterestValue = (typeof ALL_INTEREST_VALUES)[number]

function isInterestValue(value: string | null): value is InterestValue {
  return (ALL_INTEREST_VALUES as readonly string[]).includes(value ?? '')
}

export function ContactFormBlock(props: ContactFormBlockProps) {
  return (
    <React.Suspense fallback={null}>
      <ContactFormInner {...props} />
    </React.Suspense>
  )
}

function ContactFormInner({
  heading,
  body,
  successMessage,
  submitLabel,
  interestTypeOptions,
  privacyNote,
}: ContactFormBlockProps) {
  const t = useTranslations('contact')
  const searchParams = useSearchParams()
  const preselectedInterest = searchParams.get('interest')

  const [status, setStatus] = React.useState<Status>('idle')
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null)

  const configuredValues = (interestTypeOptions ?? []).filter(isInterestValue)
  const interestValues = configuredValues.length > 0 ? configuredValues : ALL_INTEREST_VALUES

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (data.get('company')) {
      setStatus('success')
      form.reset()
      return
    }

    if (!turnstileToken) {
      setStatus('captcha')
      return
    }

    setStatus('pending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: String(data.get('fullName') ?? ''),
          organization: String(data.get('organization') ?? ''),
          roleTitle: String(data.get('roleTitle') ?? ''),
          email: String(data.get('email') ?? ''),
          phone: String(data.get('phone') ?? ''),
          countryRegion: String(data.get('countryRegion') ?? ''),
          interestType: String(data.get('interestType') ?? '') || undefined,
          preferredTiming: String(data.get('preferredTiming') ?? ''),
          budgetRange: String(data.get('budgetRange') ?? ''),
          message: String(data.get('message') ?? ''),
          privacyConsent: data.get('privacyConsent') === 'on',
          turnstileToken,
          company: '',
        }),
      })

      if (!response.ok) throw new Error('Request failed')

      form.reset()
      setTurnstileToken(null)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <Section container="narrow">
        <div className="border-border bg-card flex flex-col items-center gap-4 rounded-lg border p-12 text-center">
          <CheckCircle2 className="text-primary size-10" />
          <p className="text-card-foreground text-lg font-medium">
            {successMessage ?? t('success')}
          </p>
        </div>
      </Section>
    )
  }

  return (
    <Section container="narrow">
      <SectionHeader level={2} heading={heading} intro={body} />

      <form onSubmit={onSubmit} className="mx-auto mt-12 flex max-w-xl flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-fullName">{t('fullName')}</Label>
            <Input id="contact-fullName" name="fullName" autoComplete="name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">{t('email')}</Label>
            <Input id="contact-email" name="email" type="email" autoComplete="email" required />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-organization">{t('organization')}</Label>
            <Input id="contact-organization" name="organization" autoComplete="organization" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-roleTitle">{t('roleTitle')}</Label>
            <Input id="contact-roleTitle" name="roleTitle" autoComplete="organization-title" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-phone">{t('phone')}</Label>
            <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-countryRegion">{t('countryRegion')}</Label>
            <Input id="contact-countryRegion" name="countryRegion" autoComplete="country-name" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-interestType">{t('interestType')}</Label>
          <Select
            id="contact-interestType"
            name="interestType"
            defaultValue={preselectedInterest ?? ''}
          >
            <option value="">{t('interestTypePlaceholder')}</option>
            {interestValues.map((value) => (
              <option key={value} value={value}>
                {t(`interestOptions.${value}`)}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-preferredTiming">{t('preferredTiming')}</Label>
            <Input id="contact-preferredTiming" name="preferredTiming" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-budgetRange">{t('budgetRange')}</Label>
            <Input id="contact-budgetRange" name="budgetRange" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-message">{t('message')}</Label>
          <Textarea id="contact-message" name="message" rows={5} required />
        </div>

        <div className="flex items-start gap-3">
          <Checkbox id="contact-privacyConsent" name="privacyConsent" required className="mt-0.5" />
          <Label htmlFor="contact-privacyConsent" className="text-muted-foreground font-normal">
            {t('privacyConsent')}
          </Label>
        </div>

        <div aria-hidden="true" className="hidden">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <TurnstileWidget
          siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onToken={(token) => {
            setTurnstileToken(token)
            if (token) setStatus('idle')
          }}
        />

        {status === 'captcha' ? (
          <p role="alert" className="text-destructive text-sm font-medium">
            {t('captchaRequired')}
          </p>
        ) : null}

        {status === 'error' ? (
          <p role="alert" className="text-destructive text-sm font-medium">
            {t('error')}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={status === 'pending'} className="mt-2">
          {status === 'pending' ? <Loader2 className="animate-spin" /> : null}
          {submitLabel ?? t('submit')}
        </Button>

        {privacyNote ? (
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed text-pretty">
            {privacyNote}
          </p>
        ) : null}
      </form>
    </Section>
  )
}

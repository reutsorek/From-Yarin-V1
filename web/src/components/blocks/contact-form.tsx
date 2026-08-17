'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Section, SectionHeader } from '@/components/primitives/section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ContactFormBlockValue } from './types'

export type ContactFormBlockProps = ContactFormBlockValue & { locale: string }

type Status = 'idle' | 'pending' | 'success' | 'error'

export function ContactFormBlock({
  heading,
  body,
  successMessage,
  submitLabel,
  locale,
}: ContactFormBlockProps) {
  const t = useTranslations('contact')
  const [status, setStatus] = React.useState<Status>('idle')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    if (data.get('company')) {
      setStatus('success')
      form.reset()
      return
    }

    setStatus('pending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          message: String(data.get('message') ?? ''),
          company: '',
          locale,
        }),
      })

      if (!response.ok) throw new Error('Request failed')

      form.reset()
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">{t('name')}</Label>
          <Input id="contact-name" name="name" autoComplete="name" required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">{t('email')}</Label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-message">{t('message')}</Label>
          <Textarea id="contact-message" name="message" required />
        </div>

        <div aria-hidden="true" className="hidden">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {status === 'error' ? (
          <p role="alert" className="text-destructive text-sm font-medium">
            {t('error')}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={status === 'pending'} className="mt-2">
          {status === 'pending' ? <Loader2 className="animate-spin" /> : null}
          {submitLabel ?? t('submit')}
        </Button>
      </form>
    </Section>
  )
}

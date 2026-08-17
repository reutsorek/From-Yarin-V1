'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Globe, Check } from 'lucide-react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/cn'

export interface LocaleSwitcherProps {
  locale: string
  locales: readonly string[]
  labels?: Record<string, string>
  className?: string
}

export function LocaleSwitcher({ locale, locales, labels, className }: LocaleSwitcherProps) {
  const t = useTranslations('localeSwitcher')
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()

  if (locales.length < 2) return null

  function switchTo(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t('label')}
          disabled={isPending}
          className={cn('gap-2', className)}
        >
          <Globe className="size-4" />
          <span className="uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((value) => (
          <DropdownMenuItem key={value} onSelect={() => switchTo(value)}>
            <Check className={cn('size-4', value === locale ? 'opacity-100' : 'opacity-0')} />
            <span>{labels?.[value] ?? value.toUpperCase()}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

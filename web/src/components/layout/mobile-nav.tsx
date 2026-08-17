'use client'

import * as React from 'react'
import { useTranslations } from 'next-intl'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { NavLink } from './nav-link'
import type { NavigationLink } from '@/components/blocks/types'

export interface MobileNavProps {
  links: NavigationLink[]
  locale: string
  children?: React.ReactNode
}

export function MobileNav({ links, locale, children }: MobileNavProps) {
  const t = useTranslations('nav')
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('menu')} className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="end" closeLabel={t('close')}>
        <SheetTitle className="text-foreground text-base font-semibold">{t('menu')}</SheetTitle>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link._key}
              link={link}
              locale={locale}
              onNavigate={() => setOpen(false)}
              className="text-foreground hover:bg-muted rounded-lg px-3 py-3 text-base font-medium transition-colors"
            />
          ))}
        </nav>
        {children ? <div className="mt-auto pt-6">{children}</div> : null}
      </SheetContent>
    </Sheet>
  )
}

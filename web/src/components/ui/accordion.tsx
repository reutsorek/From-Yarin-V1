'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export const Accordion = AccordionPrimitive.Root

export function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn('border-border border-b', className)} {...props} />
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'text-foreground flex flex-1 items-center justify-between gap-4 py-4 text-start text-base font-medium transition-colors',
          'hover:text-primary focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          '[&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="text-muted-foreground size-5 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn('text-muted-foreground overflow-hidden text-sm', className)}
      {...props}
    >
      <div className="pt-0 pb-5">{children}</div>
    </AccordionPrimitive.Content>
  )
}

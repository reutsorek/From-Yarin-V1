'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close
export const SheetTitle = DialogPrimitive.Title
export const SheetDescription = DialogPrimitive.Description

/** Sides are logical so the panel slides in from the inline edge that matches the document direction. */
type SheetSide = 'start' | 'end' | 'top' | 'bottom'

const sideClasses: Record<SheetSide, string> = {
  start:
    'inset-y-0 start-0 h-full w-4/5 max-w-sm border-e border-border ltr:starting:-translate-x-full rtl:starting:translate-x-full',
  end: 'inset-y-0 end-0 h-full w-4/5 max-w-sm border-s border-border ltr:starting:translate-x-full rtl:starting:-translate-x-full',
  top: 'inset-x-0 top-0 w-full border-b border-border starting:-translate-y-full',
  bottom: 'inset-x-0 bottom-0 w-full border-t border-border starting:translate-y-full',
}

export interface SheetContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  side?: SheetSide
  closeLabel: string
}

export function SheetContent({
  side = 'end',
  className,
  children,
  closeLabel,
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="bg-foreground/40 fixed inset-0 z-50 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          'bg-background fixed z-50 flex flex-col gap-6 overflow-y-auto p-6 shadow-lg transition-transform duration-300 ease-out',
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring absolute end-4 top-4 rounded-lg p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label={closeLabel}
        >
          <X className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

export function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5 text-start', className)} {...props} />
}

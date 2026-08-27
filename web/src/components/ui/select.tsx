import * as React from 'react'
import { cn } from '@/lib/cn'

export function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'border-border bg-background text-foreground flex h-10 w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

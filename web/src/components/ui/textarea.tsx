import * as React from 'react'
import { cn } from '@/lib/cn'

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'border-border bg-background text-foreground flex min-h-32 w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors',
        'placeholder:text-muted-foreground',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

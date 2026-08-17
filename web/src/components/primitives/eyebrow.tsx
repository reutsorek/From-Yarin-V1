import * as React from 'react'
import { cn } from '@/lib/cn'

export function Eyebrow({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn('text-primary text-sm font-semibold tracking-widest uppercase', className)}
      {...props}
    />
  )
}

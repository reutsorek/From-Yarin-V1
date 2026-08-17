import * as React from 'react'
import { cn } from '@/lib/cn'

/** List markers follow the inline direction, so the indent is padding-inline, not padding-left. */
export function Prose({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'prose text-foreground max-w-none',
        'prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-p:text-muted-foreground prose-li:text-muted-foreground',
        'prose-a:text-primary prose-a:font-medium prose-a:underline-offset-4',
        'prose-strong:text-foreground',
        'prose-blockquote:border-s-4 prose-blockquote:border-e-0 prose-blockquote:border-border prose-blockquote:ps-4 prose-blockquote:pe-0 prose-blockquote:not-italic prose-blockquote:text-foreground',
        'prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-muted prose-pre:text-foreground',
        'prose-hr:border-border prose-img:rounded-lg',
        'prose-ul:ps-6 prose-ul:pe-0 prose-ol:ps-6 prose-ol:pe-0 prose-li:ps-1',
        className,
      )}
      {...props}
    />
  )
}

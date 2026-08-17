import * as React from 'react'
import { cn } from '@/lib/cn'
import { Eyebrow } from './eyebrow'

type ContainerWidth = 'narrow' | 'default' | 'wide' | 'full'
type SectionSpacing = 'none' | 'compact' | 'default' | 'loose'

const containerClasses: Record<ContainerWidth, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
}

const spacingClasses: Record<SectionSpacing, string> = {
  none: 'py-0',
  compact: 'py-10 sm:py-14',
  default: 'py-16 sm:py-20 lg:py-24',
  loose: 'py-20 sm:py-28 lg:py-36',
}

export interface SectionProps extends React.ComponentProps<'section'> {
  container?: ContainerWidth
  spacing?: SectionSpacing
  containerClassName?: string
}

export function Section({
  id,
  className,
  containerClassName,
  container = 'default',
  spacing = 'default',
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('w-full', spacingClasses[spacing], id && 'scroll-mt-24', className)}
      {...props}
    >
      <div
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          containerClasses[container],
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}

export interface SectionHeaderProps {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  /** Heading level is a layout decision, never authored content. */
  level: 2 | 3
  align?: 'start' | 'center'
  className?: string
  children?: React.ReactNode
}

export function SectionHeader({
  eyebrow,
  heading,
  intro,
  level,
  align = 'center',
  className,
  children,
}: SectionHeaderProps) {
  if (!eyebrow && !heading && !intro && !children) return null

  const Heading = level === 2 ? 'h2' : 'h3'

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center'
          ? 'mx-auto max-w-3xl items-center text-center'
          : 'items-start text-start',
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {heading ? (
        <Heading
          className={cn(
            'text-foreground font-semibold tracking-tight text-balance',
            level === 2 ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl',
          )}
        >
          {heading}
        </Heading>
      ) : null}
      {intro ? (
        <p className="text-muted-foreground text-base leading-relaxed text-pretty sm:text-lg">
          {intro}
        </p>
      ) : null}
      {children}
    </div>
  )
}

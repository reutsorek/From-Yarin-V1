import { Check } from 'lucide-react'
import { Section, SectionHeader } from '@/components/primitives/section'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/cn'
import { CtaLink } from './cta-link'
import type { PricingBlockValue } from './types'

export type PricingBlockProps = PricingBlockValue & { locale: string }

const gridClasses: Record<number, string> = {
  1: 'max-w-md mx-auto',
  2: 'sm:grid-cols-2 max-w-4xl mx-auto',
  3: 'lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

export function PricingBlock({ heading, intro, plans, locale }: PricingBlockProps) {
  if (!plans?.length) return null

  const gridClass = gridClasses[plans.length] ?? gridClasses[3]

  return (
    <Section container="wide">
      <SectionHeader level={2} heading={heading} intro={intro} />
      <div className={cn('mt-14 grid grid-cols-1 items-stretch gap-6', gridClass)}>
        {plans.map((plan) => (
          <Card
            key={plan._key}
            className={cn(
              'flex h-full flex-col',
              plan.highlighted && 'border-primary ring-primary shadow-md ring-1',
            )}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              {plan.description ? <CardDescription>{plan.description}</CardDescription> : null}
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-foreground text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                {plan.period ? (
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                ) : null}
              </div>

              {plan.features?.length ? (
                <ul className="flex flex-1 flex-col gap-3 text-start">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="text-primary mt-0.5 size-4 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardContent>

            {plan.cta?.link ? (
              <CardFooter>
                <CtaLink cta={plan.cta} locale={locale} size="default" className="w-full" />
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </div>
    </Section>
  )
}

import { Quote } from 'lucide-react'
import { Section, SectionHeader } from '@/components/primitives/section'
import { Card, CardContent } from '@/components/ui/card'
import { SanityImage } from '@/components/sanity-image'
import type { TestimonialsBlockValue } from './types'

export type TestimonialsBlockProps = TestimonialsBlockValue & { locale: string }

export function TestimonialsBlock({ heading, items }: TestimonialsBlockProps) {
  if (!items?.length) return null

  return (
    <Section className="bg-muted">
      <SectionHeader level={2} heading={heading} />
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item._key} className="flex h-full flex-col">
            <CardContent className="flex h-full flex-col gap-6 p-6 pt-6">
              <Quote className="text-primary size-6 shrink-0" />
              {item.quote ? (
                <blockquote className="text-foreground flex-1 text-base leading-relaxed text-pretty">
                  {item.quote}
                </blockquote>
              ) : null}
              <div className="flex items-center gap-3">
                {item.avatar?.asset ? (
                  <SanityImage
                    image={item.avatar}
                    width={48}
                    height={48}
                    sizes="48px"
                    className="size-12 rounded-full object-cover"
                  />
                ) : null}
                <div className="min-w-0 text-start">
                  {item.authorName ? (
                    <p className="text-foreground truncate text-sm font-semibold">
                      {item.authorName}
                    </p>
                  ) : null}
                  {item.authorRole ? (
                    <p className="text-muted-foreground truncate text-sm">{item.authorRole}</p>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  )
}

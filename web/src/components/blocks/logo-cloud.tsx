import { Section } from '@/components/primitives/section'
import { SanityImage } from '@/components/sanity-image'
import type { LogoCloudBlockValue } from './types'

export type LogoCloudBlockProps = LogoCloudBlockValue & { locale: string }

export function LogoCloudBlock({ heading, logos }: LogoCloudBlockProps) {
  if (!logos?.length) return null

  return (
    <Section spacing="compact">
      {heading ? (
        <p className="text-muted-foreground text-center text-sm font-medium tracking-widest uppercase">
          {heading}
        </p>
      ) : null}
      <div className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {logos.map((logo) => (
          <div key={logo._key} className="flex items-center justify-center">
            <SanityImage
              image={logo}
              width={200}
              sizes="(max-width: 640px) 45vw, 200px"
              className="h-10 w-auto object-contain opacity-70 transition-opacity hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </Section>
  )
}

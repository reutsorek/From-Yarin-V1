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
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {logos.map((logo) => (
          <div
            key={logo._key}
            className="bg-foreground flex h-24 items-center justify-center rounded-lg px-2 py-2"
          >
            <SanityImage
              image={logo}
              width={240}
              sizes="(max-width: 640px) 45vw, 200px"
              objectPosition="center"
              className="max-h-full w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </Section>
  )
}

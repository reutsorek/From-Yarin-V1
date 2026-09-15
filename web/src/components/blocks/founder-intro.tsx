import { Section, SectionHeader } from '@/components/primitives/section'
import { SanityImage } from '@/components/sanity-image'
import { PortableTextRenderer } from '@/components/portable-text'
import type { FounderIntroBlockValue } from './types'

export type FounderIntroBlockProps = FounderIntroBlockValue & { locale: string }

export function FounderIntroBlock({ heading, intro, founder, locale }: FounderIntroBlockProps) {
  if (!founder) return null

  const hasList = Boolean(
    founder.credentials?.length || founder.affiliations?.length || founder.specialties?.length,
  )

  return (
    <Section>
      <SectionHeader level={2} heading={heading} intro={intro} />
      <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {founder.portrait?.asset ? (
          <SanityImage
            image={founder.portrait}
            width={800}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-4/5 h-auto w-full rounded-lg object-cover lg:sticky lg:top-24"
          />
        ) : null}
        <div className="flex flex-col gap-6 text-start">
          {founder.name ? (
            <div>
              <p className="text-foreground text-xl font-semibold">{founder.name}</p>
              {founder.role ? (
                <p className="text-muted-foreground text-sm">{founder.role}</p>
              ) : null}
            </div>
          ) : null}

          {founder.edgeNarrative ? (
            <p className="text-foreground border-primary border-s-2 ps-5 text-lg leading-relaxed text-pretty whitespace-pre-line italic">
              {founder.edgeNarrative}
            </p>
          ) : null}

          {founder.fullBio?.length ? (
            <div className="text-muted-foreground text-base leading-relaxed">
              <PortableTextRenderer value={founder.fullBio} locale={locale} />
            </div>
          ) : null}

          {hasList ? (
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {founder.credentials?.length ? (
                <div>
                  <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Credentials
                  </dt>
                  <dd className="mt-2 flex flex-col gap-1">
                    {founder.credentials.map((item, index) => (
                      <span key={index} className="text-foreground text-sm">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
              {founder.affiliations?.length ? (
                <div>
                  <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Affiliations
                  </dt>
                  <dd className="mt-2 flex flex-col gap-1">
                    {founder.affiliations.map((item, index) => (
                      <span key={index} className="text-foreground text-sm">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
              {founder.specialties?.length ? (
                <div>
                  <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    Specialties
                  </dt>
                  <dd className="mt-2 flex flex-col gap-1">
                    {founder.specialties.map((item, index) => (
                      <span key={index} className="text-foreground text-sm">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {founder.speakingAndAdvisoryCopy?.length ? (
            <div className="border-border bg-card rounded-lg border p-6">
              <p className="text-foreground text-sm font-semibold tracking-wide uppercase">
                Speaking and advisory
              </p>
              <div className="text-muted-foreground mt-3 text-sm leading-relaxed">
                <PortableTextRenderer value={founder.speakingAndAdvisoryCopy} locale={locale} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  )
}

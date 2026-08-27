import { stegaClean } from 'next-sanity'
import { Section, SectionHeader } from '@/components/primitives/section'
import { SanityImage } from '@/components/sanity-image'
import { PortableTextRenderer } from '@/components/portable-text'
import { Badge } from '@/components/ui/badge'
import { InquiryCta } from './inquiry-cta'
import type { SpeakingTopicItem, SpeakingTopicsBlockValue } from './types'

export type SpeakingTopicsBlockProps = SpeakingTopicsBlockValue & { locale: string }

const FORMAT_LABELS: Record<string, string> = {
  keynote: 'Keynote',
  fireside: 'Fireside chat',
  briefing: 'Executive briefing',
  workshop: 'Workshop',
  moderated: 'Moderated discussion',
}

export function SpeakingTopicsBlock({
  heading,
  intro,
  topics,
  displayMode,
  locale,
}: SpeakingTopicsBlockProps) {
  if (!topics?.length) return null

  const mode = stegaClean(displayMode) ?? 'preview'

  return (
    <Section>
      <SectionHeader level={2} heading={heading} intro={intro} />
      {mode === 'preview' ? (
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic._id} topic={topic} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="mt-14 flex flex-col gap-20">
          {topics.map((topic) => (
            <TopicDetail key={topic._id} topic={topic} locale={locale} />
          ))}
        </div>
      )}
    </Section>
  )
}

function FormatBadges({ formats }: { formats: readonly (string | null)[] | null | undefined }) {
  if (!formats?.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map((format, index) =>
        format ? (
          <Badge key={index} variant="secondary">
            {FORMAT_LABELS[format] ?? format}
          </Badge>
        ) : null,
      )}
    </div>
  )
}

function TopicCard({ topic, locale }: { topic: SpeakingTopicItem; locale: string }) {
  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-8 text-start">
      {topic.heroImage?.asset ? (
        <SanityImage
          image={topic.heroImage}
          width={700}
          sizes="(max-width: 640px) 100vw, 33vw"
          className="aspect-4/3 h-auto w-full rounded-lg object-cover"
        />
      ) : null}
      {topic.title ? (
        <h3 className="text-foreground text-lg font-semibold tracking-tight">{topic.title}</h3>
      ) : null}
      {topic.shortDescription ? (
        <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
          {topic.shortDescription}
        </p>
      ) : null}
      <FormatBadges formats={topic.availableFormats} />
      <div className="mt-2">
        <InquiryCta
          label={topic.ctaLabel}
          inquiryType="speaking"
          locale={locale}
          variant="secondary"
          size="default"
        />
      </div>
    </div>
  )
}

function TopicDetail({ topic, locale }: { topic: SpeakingTopicItem; locale: string }) {
  return (
    <article className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">
      {topic.heroImage?.asset ? (
        <SanityImage
          image={topic.heroImage}
          width={960}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="aspect-4/3 h-auto w-full rounded-lg object-cover"
        />
      ) : null}
      <div className="flex flex-col gap-5 text-start">
        {topic.title ? (
          <h3 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {topic.title}
          </h3>
        ) : null}
        {topic.fullDescription?.length ? (
          <div className="text-muted-foreground text-base leading-relaxed">
            <PortableTextRenderer value={topic.fullDescription} locale={locale} />
          </div>
        ) : topic.shortDescription ? (
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            {topic.shortDescription}
          </p>
        ) : null}
        <FormatBadges formats={topic.availableFormats} />
        {topic.idealAudience?.length ? (
          <div className="flex flex-col gap-2">
            <h4 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              Best fit audiences
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {topic.idealAudience.join(', ')}
            </p>
          </div>
        ) : null}
        {topic.keyTakeaways?.length ? (
          <div className="flex flex-col gap-2">
            <h4 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              Takeaways
            </h4>
            <ul className="flex flex-col gap-2">
              {topic.keyTakeaways.map((item, index) => (
                <li key={index} className="text-muted-foreground text-sm leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-2">
          <InquiryCta label={topic.ctaLabel} inquiryType="speaking" locale={locale} />
        </div>
      </div>
    </article>
  )
}

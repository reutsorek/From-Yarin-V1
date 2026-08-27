import { Section, SectionHeader } from '@/components/primitives/section'
import { SanityImage } from '@/components/sanity-image'
import { Badge } from '@/components/ui/badge'
import type { PublicationItem, ResearchGridBlockValue, ResearchProjectItem } from './types'

export type ResearchGridBlockProps = ResearchGridBlockValue & { locale: string }

const PUBLICATION_TYPE_LABELS: Record<string, string> = {
  publication: 'Publication',
  talk: 'Talk',
  media: 'Media',
}

export function ResearchGridBlock({
  heading,
  intro,
  emptyStateText,
  projects,
  publications,
}: ResearchGridBlockProps) {
  const hasContent = Boolean(projects?.length || publications?.length)

  return (
    <Section>
      <SectionHeader level={2} heading={heading} intro={intro} />
      {hasContent ? (
        <div className="mt-14 flex flex-col gap-16">
          {projects?.length ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : null}
          {publications?.length ? (
            <ul className="border-border divide-border divide-y rounded-lg border">
              {publications.map((publication) => (
                <PublicationRow key={publication._id} publication={publication} />
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <div className="border-border bg-card mx-auto mt-14 max-w-2xl rounded-lg border p-10 text-center">
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            {emptyStateText ??
              'Research projects and publications will appear here as they are confirmed.'}
          </p>
        </div>
      )}
    </Section>
  )
}

function ProjectCard({ project }: { project: ResearchProjectItem }) {
  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-6 text-start">
      {project.image?.asset ? (
        <SanityImage
          image={project.image}
          width={700}
          sizes="(max-width: 640px) 100vw, 33vw"
          className="aspect-4/3 h-auto w-full rounded-lg object-cover"
        />
      ) : null}
      <div className="flex items-center justify-between gap-2">
        {project.title ? (
          <h3 className="text-foreground text-base font-semibold">{project.title}</h3>
        ) : null}
        {project.status ? (
          <Badge variant="muted" className="shrink-0 capitalize">
            {project.status}
          </Badge>
        ) : null}
      </div>
      {project.excerpt ? (
        <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
          {project.excerpt}
        </p>
      ) : null}
      {project.focusAreas?.length ? (
        <div className="flex flex-wrap gap-2">
          {project.focusAreas.map((area, index) => (
            <Badge key={index} variant="outline">
              {area}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function PublicationRow({ publication }: { publication: PublicationItem }) {
  const content = (
    <div className="flex flex-col gap-1 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {publication.type ? (
          <Badge variant="muted">
            {PUBLICATION_TYPE_LABELS[publication.type] ?? publication.type}
          </Badge>
        ) : null}
        {publication.title ? (
          <span className="text-foreground text-sm font-semibold">{publication.title}</span>
        ) : null}
      </div>
      {publication.outlet || publication.date ? (
        <p className="text-muted-foreground text-xs">
          {[publication.outlet, publication.date].filter(Boolean).join(' · ')}
        </p>
      ) : null}
      {publication.excerpt ? (
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed text-pretty">
          {publication.excerpt}
        </p>
      ) : null}
    </div>
  )

  if (!publication.url) return <li>{content}</li>

  return (
    <li>
      <a
        href={publication.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:bg-muted block transition-colors"
      >
        {content}
      </a>
    </li>
  )
}

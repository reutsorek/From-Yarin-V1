import {
  Activity,
  BarChart3,
  Bolt,
  CheckCircle2,
  Globe,
  Heart,
  Layers,
  LineChart,
  Lock,
  MessageCircle,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Section, SectionHeader } from '@/components/primitives/section'
import { cn } from '@/lib/cn'
import type { FeatureGridBlockValue } from './types'

const icons: Record<string, LucideIcon> = {
  activity: Activity,
  bolt: Bolt,
  chart: BarChart3,
  check: CheckCircle2,
  globe: Globe,
  heart: Heart,
  layers: Layers,
  lineChart: LineChart,
  lock: Lock,
  message: MessageCircle,
  rocket: Rocket,
  search: Search,
  settings: Settings,
  shield: Shield,
  sparkles: Sparkles,
  star: Star,
  users: Users,
  zap: Zap,
}

const columnClasses: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

export type FeatureGridBlockProps = FeatureGridBlockValue & { locale: string }

export function FeatureGridBlock({ heading, intro, columns, features }: FeatureGridBlockProps) {
  if (!features?.length) return null

  const gridClass = columnClasses[columns ?? 3] ?? columnClasses[3]

  return (
    <Section>
      <SectionHeader level={2} heading={heading} intro={intro} />
      <div className={cn('mt-14 grid grid-cols-1 gap-8', gridClass)}>
        {features.map((feature) => {
          const Icon = feature.icon ? icons[feature.icon] : undefined

          return (
            <div key={feature._key} className="flex flex-col gap-3 text-start">
              {Icon ? (
                <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </span>
              ) : null}
              {feature.title ? (
                <h3 className="text-foreground text-lg font-semibold">{feature.title}</h3>
              ) : null}
              {feature.description ? (
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                  {feature.description}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </Section>
  )
}

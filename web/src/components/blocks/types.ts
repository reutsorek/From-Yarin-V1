/**
 * Derived from the generated query result types, never hand written. Adding a block
 * to the schema and regenerating makes the PageBuilder switch non-exhaustive, which
 * is a type error rather than a blank section on the page.
 */
import type { StegaBranded } from '@sanity/client/stega'
import type {
  HOME_PAGE_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  POST_BY_SLUG_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from '@/sanity.types'

/**
 * sanityFetch brands every string in the result as StegaString, so the component
 * types have to be branded too. Comparing a branded string to a literal is a type
 * error on purpose: that is the case where you owe the code a stegaClean().
 */
type Page = NonNullable<StegaBranded<HOME_PAGE_QUERY_RESULT>>

export type PageBuilderBlock = NonNullable<Page['pageBuilder']>[number]

type BlockOf<T extends PageBuilderBlock['_type']> = Extract<PageBuilderBlock, { _type: T }>

export type HeroBlockValue = BlockOf<'heroBlock'>
export type RichTextBlockValue = BlockOf<'richTextBlock'>
export type FeatureGridBlockValue = BlockOf<'featureGridBlock'>
export type LogoCloudBlockValue = BlockOf<'logoCloudBlock'>
export type TestimonialsBlockValue = BlockOf<'testimonialsBlock'>
export type StatsBlockValue = BlockOf<'statsBlock'>
export type FaqsBlockValue = BlockOf<'faqsBlock'>
export type PricingBlockValue = BlockOf<'pricingBlock'>
export type CtaBlockValue = BlockOf<'ctaBlock'>
export type ContactFormBlockValue = BlockOf<'contactFormBlock'>

export type ProjectedCta = NonNullable<HeroBlockValue['ctas']>[number]
export type ProjectedLink = NonNullable<ProjectedCta['link']>
export type ProjectedImage = NonNullable<HeroBlockValue['image']>

export type FeatureItem = NonNullable<FeatureGridBlockValue['features']>[number]
export type LogoItem = NonNullable<LogoCloudBlockValue['logos']>[number]
export type TestimonialItem = NonNullable<TestimonialsBlockValue['items']>[number]
export type StatItem = NonNullable<StatsBlockValue['items']>[number]
export type FaqReferencedItem = NonNullable<FaqsBlockValue['items']>[number]
export type FaqInlineItem = NonNullable<FaqsBlockValue['inlineItems']>[number]
export type PricingPlan = NonNullable<PricingBlockValue['plans']>[number]

export type PortableTextValue = NonNullable<RichTextBlockValue['body']>

export type NavigationValue = StegaBranded<NAVIGATION_QUERY_RESULT>
export type NavigationLink = NonNullable<NonNullable<NavigationValue>['headerLinks']>[number]
export type FooterGroup = NonNullable<NonNullable<NavigationValue>['footerGroups']>[number]

export type SiteSettingsValue = StegaBranded<SITE_SETTINGS_QUERY_RESULT>
export type SocialLink = NonNullable<NonNullable<SiteSettingsValue>['socials']>[number]

export type PostValue = NonNullable<StegaBranded<POST_BY_SLUG_QUERY_RESULT>>

export interface BlockProps {
  locale: string
  documentId?: string
}

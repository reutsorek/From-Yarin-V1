/**
 * Derived from the generated query result types, never hand written. Adding a block
 * to the schema and regenerating makes the PageBuilder switch non-exhaustive, which
 * is a type error rather than a blank section on the page.
 *
 * The installed next-sanity version (pinned to match this project's Sanity Studio
 * version) types sanityFetch's data as the plain query result, not stega-branded, so
 * these types intentionally do not re-wrap in StegaBranded. Call stegaClean() before
 * comparing a string to a literal, using one as a key, or passing it to a third party;
 * the type system will not catch a missed call the way it would with branding.
 */
import type {
  HOME_PAGE_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from '@/sanity.types'

type Page = NonNullable<HOME_PAGE_QUERY_RESULT>

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
export type PositioningBlockValue = BlockOf<'positioningBlock'>
export type AudiencePathsBlockValue = BlockOf<'audiencePathsBlock'>
export type ExpeditionProductsBlockValue = BlockOf<'expeditionProductsBlock'>
export type SpeakingTopicsBlockValue = BlockOf<'speakingTopicsBlock'>
export type ResearchHighlightsBlockValue = BlockOf<'researchHighlightsBlock'>
export type ResearchGridBlockValue = BlockOf<'researchGridBlock'>
export type FounderIntroBlockValue = BlockOf<'founderIntroBlock'>

export type AudiencePathItem = NonNullable<AudiencePathsBlockValue['paths']>[number]
export type ExpeditionProductItem = NonNullable<ExpeditionProductsBlockValue['products']>[number]
export type SpeakingTopicItem = NonNullable<SpeakingTopicsBlockValue['topics']>[number]
export type ResearchFocusAreaItem = NonNullable<ResearchHighlightsBlockValue['items']>[number]
export type ResearchProjectItem = NonNullable<ResearchGridBlockValue['projects']>[number]
export type PublicationItem = NonNullable<ResearchGridBlockValue['publications']>[number]
export type FounderProfileValue = NonNullable<FounderIntroBlockValue['founder']>

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

export type NavigationValue = NAVIGATION_QUERY_RESULT
export type NavigationLink = NonNullable<NonNullable<NavigationValue>['headerLinks']>[number]
export type FooterGroup = NonNullable<NonNullable<NavigationValue>['footerGroups']>[number]

export type SiteSettingsValue = SITE_SETTINGS_QUERY_RESULT
export type SocialLink = NonNullable<NonNullable<SiteSettingsValue>['socials']>[number]

export interface BlockProps {
  locale: string
  documentId?: string
}

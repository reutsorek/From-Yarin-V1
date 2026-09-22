/**
 * Projection fragments. A field added to the schema is projected here once, so no
 * query can quietly fall behind the content model.
 *
 * LQIP and dimensions are not returned by default, so IMAGE_FRAGMENT asks for them.
 */

export const IMAGE_FRAGMENT = /* groq */ `
  _type,
  alt,
  caption,
  hotspot,
  crop,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions { width, height } }
  }
`

export const LINK_FRAGMENT = /* groq */ `
  label,
  labelHe,
  kind,
  href,
  reference->{ _type, "slug": slug.current, language }
`

export const CTA_FRAGMENT = /* groq */ `
  variant,
  link { ${LINK_FRAGMENT} }
`

export const PORTABLE_TEXT_FRAGMENT = /* groq */ `
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      reference->{ _type, "slug": slug.current, language }
    }
  },
  _type == "imageWithAlt" => { ${IMAGE_FRAGMENT} }
`

/** Fallback logic lives here, not in components, so every surface agrees on it. */
export const SEO_FRAGMENT = /* groq */ `
  "title": coalesce(seo.metaTitle, title, ""),
  "description": coalesce(seo.metaDescription, ""),
  "keywords": coalesce(seo.keywords, []),
  "image": seo.ogImage { ${IMAGE_FRAGMENT} },
  "canonicalUrl": seo.canonicalUrl,
  "noIndex": seo.noIndex == true
`

export const EXPEDITION_PRODUCT_FRAGMENT = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  order,
  shortDescription,
  fullDescription[] { ${PORTABLE_TEXT_FRAGMENT} },
  idealFor,
  duration,
  recommendedGroupSize,
  includedItems,
  potentialOutcomes,
  deliverables,
  strategicOutcome,
  engagementModel,
  useCases,
  images[] { ${IMAGE_FRAGMENT} },
  ctaLabel,
  ctaInquiryType
`

export const AUDIENCE_PATH_FRAGMENT = /* groq */ `
  _id,
  audienceName,
  headline,
  motivation,
  valueProposition,
  desiredOutcomes,
  image { ${IMAGE_FRAGMENT} },
  cta { ${CTA_FRAGMENT} }
`

export const SPEAKING_TOPIC_FRAGMENT = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  fullDescription[] { ${PORTABLE_TEXT_FRAGMENT} },
  idealAudience,
  keyTakeaways,
  availableFormats,
  heroImage { ${IMAGE_FRAGMENT} },
  ctaLabel
`

export const RESEARCH_PROJECT_FRAGMENT = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  status,
  excerpt,
  focusAreas,
  links[] { label, url },
  "image": images[0] { ${IMAGE_FRAGMENT} }
`

export const PUBLICATION_FRAGMENT = /* groq */ `
  _id,
  type,
  title,
  outlet,
  date,
  url,
  excerpt,
  image { ${IMAGE_FRAGMENT} }
`

export const FOUNDER_PROFILE_FRAGMENT = /* groq */ `
  _id,
  name,
  role,
  shortBio,
  fullBio[] { ${PORTABLE_TEXT_FRAGMENT} },
  portrait { ${IMAGE_FRAGMENT} },
  edgeNarrative,
  credentials,
  affiliations,
  specialties,
  speakingAndAdvisoryCopy[] { ${PORTABLE_TEXT_FRAGMENT} }
`

export const PAGE_BUILDER_FRAGMENT = /* groq */ `
  pageBuilder[]{
    _key,
    _type,
    _type == "heroBlock" => {
      eyebrow, heading, subheading, layout,
      image { ${IMAGE_FRAGMENT} },
      ctas[] { _key, ${CTA_FRAGMENT} }
    },
    _type == "richTextBlock" => {
      heading, width,
      body[] { ${PORTABLE_TEXT_FRAGMENT} }
    },
    _type == "featureGridBlock" => {
      heading, intro, columns,
      features[] { _key, icon, title, description }
    },
    _type == "logoCloudBlock" => {
      heading,
      logos[] { _key, ${IMAGE_FRAGMENT}, url }
    },
    _type == "testimonialsBlock" => {
      heading,
      items[] { _key, quote, authorName, authorRole, avatar { ${IMAGE_FRAGMENT} } }
    },
    _type == "statsBlock" => {
      heading,
      items[] { _key, value, label }
    },
    _type == "faqsBlock" => {
      heading, source,
      items[]->{ _id, question, answer[] { ${PORTABLE_TEXT_FRAGMENT} } },
      inlineItems[] { _key, question, answer[] { ${PORTABLE_TEXT_FRAGMENT} } }
    },
    _type == "pricingBlock" => {
      heading, intro,
      plans[] { _key, name, price, period, description, features, highlighted, cta { ${CTA_FRAGMENT} } }
    },
    _type == "ctaBlock" => {
      heading, body, background,
      ctas[] { _key, ${CTA_FRAGMENT} }
    },
    _type == "contactFormBlock" => {
      heading, body, successMessage, submitLabel, interestTypeOptions, privacyNote
    },
    _type == "positioningBlock" => {
      heading, intro, notThisItems, butThisHeading, butThisText
    },
    _type == "audiencePathsBlock" => {
      heading, intro,
      paths[]-> { ${AUDIENCE_PATH_FRAGMENT} }
    },
    _type == "expeditionProductsBlock" => {
      heading, intro, displayMode,
      products[]-> { ${EXPEDITION_PRODUCT_FRAGMENT} }
    },
    _type == "speakingTopicsBlock" => {
      heading, intro, displayMode,
      topics[]-> { ${SPEAKING_TOPIC_FRAGMENT} }
    },
    _type == "researchHighlightsBlock" => {
      heading, intro,
      items[] { _key, title, description }
    },
    _type == "researchGridBlock" => {
      heading, intro, emptyStateText, googleScholarUrl, orcidUrl,
      "projects": *[_type == "researchProject" && language == $locale] | order(_createdAt desc) {
        ${RESEARCH_PROJECT_FRAGMENT}
      },
      "publications": *[_type == "publicationOrMedia" && language == $locale] | order(date desc) {
        ${PUBLICATION_FRAGMENT}
      }
    },
    _type == "founderIntroBlock" => {
      heading, intro,
      founder-> { ${FOUNDER_PROFILE_FRAGMENT} }
    }
  }
`

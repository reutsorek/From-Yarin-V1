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
      logos[] { _key, ${IMAGE_FRAGMENT} }
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
      heading, body, successMessage, submitLabel
    }
  }
`

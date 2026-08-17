import { defineField } from 'sanity'

/**
 * Composable field builders. Every document type uses these instead of copy-pasting
 * field blocks, which is how the fields drift apart in the first place.
 */

export function slugField(source = 'title') {
  return defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required(),
  })
}

export function seoField() {
  return defineField({
    name: 'seo',
    title: 'SEO',
    type: 'seo',
    group: 'seo',
  })
}

export function languageField() {
  return defineField({
    name: 'language',
    type: 'string',
    readOnly: true,
    hidden: true,
  })
}

export function imageField(name = 'image', title = 'Image') {
  return defineField({
    name,
    title,
    type: 'imageWithAlt',
  })
}

export const contentGroups = [
  { name: 'content', title: 'Content', default: true },
  { name: 'seo', title: 'SEO' },
]

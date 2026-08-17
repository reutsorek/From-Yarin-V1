import { SearchIcon } from '@sanity/icons/Search'
import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the page title in search results. Up to 60 characters.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Up to 160 characters.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      options: { hotspot: true },
      description: '1200x630 recommended. Falls back to a generated image when empty.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Only set this when the page duplicates content that lives elsewhere.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

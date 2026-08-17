import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { contentGroups, imageField, languageField, seoField, slugField } from '../shared/fields'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: contentGroups,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    { ...slugField(), group: 'content' },
    { ...languageField(), group: 'content' },
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    { ...imageField('coverImage', 'Cover image'), group: 'content' },
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'body', title: 'Body', type: 'portableText', group: 'content' }),
    seoField(),
  ],
  orderings: [
    {
      name: 'publishedAtDesc',
      title: 'Newest first',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', publishedAt: 'publishedAt', media: 'coverImage' },
    prepare({ title, publishedAt, media }) {
      const date = publishedAt ? new Date(publishedAt).toISOString().slice(0, 10) : 'Not published'
      return { title: title || 'Untitled post', subtitle: date, media }
    },
  },
})

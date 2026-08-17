import { DocumentIcon } from '@sanity/icons/Document'
import { defineField, defineType } from 'sanity'
import { contentGroups, languageField, seoField, slugField } from '../shared/fields'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
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
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'pageBuilder',
      group: 'content',
    }),
    seoField(),
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return { title: title || 'Untitled page', subtitle: slug ? `/${slug}` : 'No slug' }
    },
  },
})

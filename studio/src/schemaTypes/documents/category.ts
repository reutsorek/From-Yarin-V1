import { TagIcon } from '@sanity/icons/Tag'
import { defineField, defineType } from 'sanity'
import { slugField } from '../shared/fields'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})

import { DocumentsIcon } from '@sanity/icons/Documents'
import { defineField, defineType } from 'sanity'
import { imageField, languageField } from '../shared/fields'

export const publicationOrMedia = defineType({
  name: 'publicationOrMedia',
  title: 'Publication or media',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    languageField(),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Publication', value: 'publication' },
          { title: 'Talk', value: 'talk' },
          { title: 'Media', value: 'media' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'outlet', title: 'Outlet / venue', type: 'string' }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'url', title: 'URL', type: 'url' }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    imageField('image', 'Image (optional)'),
  ],
  preview: {
    select: { title: 'title', subtitle: 'outlet', media: 'image' },
  },
})

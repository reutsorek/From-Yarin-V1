import { UserIcon } from '@sanity/icons/User'
import { defineField, defineType } from 'sanity'
import { imageField, slugField } from '../shared/fields'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField('name'),
    imageField('photo', 'Photo'),
    defineField({ name: 'bio', title: 'Bio', type: 'portableText' }),
  ],
  preview: {
    select: { title: 'name', media: 'photo' },
  },
})

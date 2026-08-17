import { MenuIcon } from '@sanity/icons/Menu'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'headerLinks',
      title: 'Header links',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
    }),
    defineField({
      name: 'footerGroups',
      title: 'Footer groups',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerGroup',
          title: 'Footer group',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({ type: 'link' })],
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
    }),
    defineField({ name: 'footerNote', title: 'Footer note', type: 'string' }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation' }),
  },
})

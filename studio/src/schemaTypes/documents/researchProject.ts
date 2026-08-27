import { BulbOutlineIcon } from '@sanity/icons/BulbOutline'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { contentGroups, imageField, languageField, seoField, slugField } from '../shared/fields'

export const researchProject = defineType({
  name: 'researchProject',
  title: 'Research project',
  type: 'document',
  icon: BulbOutlineIcon,
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
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Planned', value: 'planned' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'body', title: 'Body', type: 'portableText', group: 'content' }),
    defineField({
      name: 'focusAreas',
      title: 'Focus areas',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      group: 'content',
    }),
    defineField({
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      group: 'content',
      description: 'Only list verified collaborators or institutions.',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'projectLink',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      group: 'content',
    }),
    defineField({
      name: 'relatedPublications',
      title: 'Related publications',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'publicationOrMedia' }] })],
      group: 'content',
    }),
    seoField(),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status' },
  },
})

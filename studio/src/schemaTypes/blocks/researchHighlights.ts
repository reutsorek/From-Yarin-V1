import { BulbOutlineIcon } from '@sanity/icons/BulbOutline'
import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Static thematic framing copy (focus areas), not a claimed result or reference to real
 * research output. Used for the homepage preview only; the Research & Impact page's
 * researchGridBlock renders the actual researchProject/publicationOrMedia documents.
 */
export const researchHighlightsBlock = defineType({
  name: 'researchHighlightsBlock',
  title: 'Research highlights',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 2 }),
    defineField({
      name: 'items',
      title: 'Focus areas',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'focusArea',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Research highlights',
        subtitle: 'Research highlights',
        media: BulbOutlineIcon,
      }
    },
  },
})

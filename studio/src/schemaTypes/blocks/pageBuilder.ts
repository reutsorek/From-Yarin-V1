import { defineArrayMember, defineType } from 'sanity'

export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Page builder',
  type: 'array',
  of: [
    defineArrayMember({ type: 'heroBlock' }),
    defineArrayMember({ type: 'richTextBlock' }),
    defineArrayMember({ type: 'featureGridBlock' }),
    defineArrayMember({ type: 'logoCloudBlock' }),
    defineArrayMember({ type: 'testimonialsBlock' }),
    defineArrayMember({ type: 'statsBlock' }),
    defineArrayMember({ type: 'faqsBlock' }),
    defineArrayMember({ type: 'pricingBlock' }),
    defineArrayMember({ type: 'ctaBlock' }),
    defineArrayMember({ type: 'contactFormBlock' }),
  ],
  options: {
    insertMenu: {
      views: [
        {
          name: 'grid',
          previewImageUrl: (schemaTypeName) => `/block-previews/${schemaTypeName}.png`,
        },
      ],
    },
  },
})

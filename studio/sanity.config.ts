import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'

import { dataset, previewOrigin, projectId, supportedLanguages } from './env'
import { resolve } from './src/presentation/resolve'
import { LOCALIZED_TYPES, SINGLETON_TYPES, schemaTypes } from './src/schemaTypes'
import { structure } from './src/structure'

const singletons = SINGLETON_TYPES as readonly string[]
const localized = LOCALIZED_TYPES as readonly string[]

export default defineConfig({
  name: 'default',
  title: 'Next Sanity Boilerplate',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        origin: previewOrigin,
        previewMode: { enable: '/api/draft-mode/enable' },
      },
    }),
    documentInternationalization({
      supportedLanguages: supportedLanguages.map((language) => ({
        id: language.id,
        title: language.title,
      })),
      schemaTypes: [...localized],
    }),
    media(),
    ...(process.env.NODE_ENV === 'development' ? [visionTool()] : []),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      // Singletons are reached through the structure, so they must not appear in "Create new".
      ...prev.filter((template) => !singletons.includes(template.schemaType)),
      ...localized.map((schemaType) => ({
        id: `${schemaType}-with-language`,
        title: `${schemaType} with language`,
        schemaType,
        parameters: [{ name: 'language', type: 'string' }],
        value: (params: { language: string }) => ({ language: params.language }),
      })),
    ],
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => !singletons.includes(item.templateId ?? '')),
    actions: (prev, { schemaType }) =>
      singletons.includes(schemaType)
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate')
        : prev,
  },
  tasks: { enabled: false },
  scheduledPublishing: { enabled: false },
})

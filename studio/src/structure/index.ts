import { CogIcon } from '@sanity/icons/Cog'
import { MenuIcon } from '@sanity/icons/Menu'
import type { StructureResolver } from 'sanity/structure'
import { supportedLanguages } from '../../env'
import { LOCALIZED_TYPES, SINGLETON_TYPES } from '../schemaTypes'

const HIDDEN_FROM_LIST: string[] = [
  ...SINGLETON_TYPES,
  // Translation links are managed by the language switcher, not browsed directly.
  'translation.metadata',
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(S.document().schemaType('navigation').documentId('navigation')),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((item) => !HIDDEN_FROM_LIST.includes(item.getId() ?? ''))
        .map((item) => {
          const typeName = item.getId() ?? ''
          if (!LOCALIZED_TYPES.includes(typeName as (typeof LOCALIZED_TYPES)[number])) return item
          return item.child(
            S.list()
              .title(item.getTitle() ?? typeName)
              .items(
                supportedLanguages.map((language) =>
                  S.listItem()
                    .id(language.id)
                    .title(language.title)
                    .child(
                      S.documentTypeList(typeName)
                        .title(`${item.getTitle() ?? typeName} (${language.title})`)
                        .filter('_type == $type && language == $language')
                        .params({ type: typeName, language: language.id })
                        .initialValueTemplates([
                          S.initialValueTemplateItem(`${typeName}-with-language`, {
                            language: language.id,
                          }),
                        ]),
                    ),
                ),
              ),
          )
        }),
    ])

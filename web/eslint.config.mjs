import next from 'eslint-config-next'
import tseslint from 'typescript-eslint'
import local from '../eslint-local-rules/index.js'

const config = [
  {
    ignores: ['.next/**', 'sanity.types.ts', 'node_modules/**', 'next-env.d.ts'],
  },
  ...next,
  ...tseslint.configs.recommended,
  {
    // Pinned, not 'detect': eslint-plugin-react's version sniffing uses an ESLint 9 API
    // that was removed in ESLint 10 and throws while loading its rules.
    settings: { react: { version: '19.2' } },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { local },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['src/**/*.tsx'],
    rules: {
      'local/no-physical-direction': 'error',
      'local/no-literal-colors': 'error',
      'local/no-ui-dashes': 'error',
      'local/require-url-builder': 'error',
    },
  },
  {
    files: ['src/app/**/page.tsx', 'src/app/**/layout.tsx'],
    rules: {
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // Satori renders the OG image without an html element, so direction has to be inline there.
    files: ['src/app/api/og/**'],
    rules: { 'local/no-physical-direction': 'off' },
  },
]

export default config

import path from 'node:path'

/**
 * ESLint is configured per workspace, so staged files are handed to the config
 * that owns them. Running eslint from the repo root finds no config at all.
 */
const toWebPaths = (files) =>
  files.map((file) => path.relative(path.join(process.cwd(), 'web'), file)).join(' ')

export default {
  'web/**/*.{ts,tsx}': (files) => [
    `npm run lint -w web -- --fix --no-warn-ignored ${toWebPaths(files)}`,
    `prettier --write ${files.join(' ')}`,
  ],
  '!(web)/**/*.{ts,tsx}': (files) => [`prettier --write ${files.join(' ')}`],
  '*.{json,md,css,mjs,js,yml,yaml}': (files) => [`prettier --write ${files.join(' ')}`],
}

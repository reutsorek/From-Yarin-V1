#!/usr/bin/env node
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)
const root = path.resolve(path.dirname(scriptPath), '..')

const PLACEHOLDER = 'next-sanity-boilerplate'
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const PROJECT_ID_PATTERN = /^[a-z0-9]+$/
const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'out', 'coverage', '.vercel'])
const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.mdx',
  '.css',
  '.yml',
  '.yaml',
  '.html',
  '.txt',
  '.example',
])

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}

function parseArgs(argv) {
  const flags = {}
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) continue
    const equals = arg.indexOf('=')
    if (equals !== -1) {
      flags[arg.slice(2, equals)] = arg.slice(equals + 1)
      continue
    }
    const key = arg.slice(2)
    const next = argv[index + 1]
    if (!next || next.startsWith('--')) {
      flags[key] = true
      continue
    }
    flags[key] = next
    index += 1
  }
  return flags
}

function validate(answers) {
  if (!NAME_PATTERN.test(answers.name)) {
    fail(`project name "${answers.name}" must be kebab-case, for example acme-marketing`)
  }
  if (!answers.title || !answers.title.trim()) fail('project title is required')
  if (!PROJECT_ID_PATTERN.test(answers.projectId)) {
    fail(`Sanity project id "${answers.projectId}" must match ^[a-z0-9]+$`)
  }
  if (!answers.dataset || !/^[a-z0-9._-]+$/.test(answers.dataset)) {
    fail(`dataset "${answers.dataset}" is not a valid dataset name`)
  }
  try {
    const url = new URL(answers.siteUrl)
    answers.siteUrl = url.origin
  } catch {
    fail(`site URL "${answers.siteUrl}" is not a valid absolute URL`)
  }
}

function titleFromName(name) {
  return name
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

async function ask(rl, question, fallback, check) {
  for (;;) {
    const suffix = fallback ? ` (${fallback})` : ''
    const raw = (await rl.question(`${question}${suffix}: `)).trim()
    const value = raw || fallback || ''
    if (!value) {
      console.error('A value is required.')
      continue
    }
    if (check && !check(value)) {
      console.error('That value is not valid, please try again.')
      continue
    }
    return value
  }
}

async function collect(flags) {
  const defaults = {
    name: path.basename(root) === PLACEHOLDER ? '' : path.basename(root),
    dataset: 'production',
    siteUrl: 'https://example.com',
  }

  if (flags.yes) {
    const answers = {
      name: typeof flags.name === 'string' ? flags.name : defaults.name,
      title: typeof flags.title === 'string' ? flags.title : '',
      projectId: typeof flags['project-id'] === 'string' ? flags['project-id'] : '',
      dataset: typeof flags.dataset === 'string' ? flags.dataset : defaults.dataset,
      siteUrl: typeof flags['site-url'] === 'string' ? flags['site-url'] : defaults.siteUrl,
    }
    if (!answers.name) fail('--name is required with --yes')
    if (!answers.projectId) fail('--project-id is required with --yes')
    if (!answers.title) answers.title = titleFromName(answers.name)
    return answers
  }

  const rl = createInterface({ input: stdin, output: stdout })
  try {
    const name = await ask(rl, 'Project name (kebab-case)', defaults.name, (value) =>
      NAME_PATTERN.test(value),
    )
    const title = await ask(rl, 'Human readable title', titleFromName(name))
    const projectId = await ask(rl, 'Sanity project id', '', (value) =>
      PROJECT_ID_PATTERN.test(value),
    )
    const dataset = await ask(rl, 'Sanity dataset', defaults.dataset)
    const siteUrl = await ask(rl, 'Production site URL', defaults.siteUrl, (value) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    })
    return { name, title, projectId, dataset, siteUrl }
  } finally {
    rl.close()
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function renamePackages(answers) {
  const targets = [
    { file: path.join(root, 'package.json'), name: answers.name },
    { file: path.join(root, 'web', 'package.json'), name: `${answers.name}-web` },
    { file: path.join(root, 'studio', 'package.json'), name: `${answers.name}-studio` },
  ]
  for (const target of targets) {
    if (!fs.existsSync(target.file)) continue
    const json = readJson(target.file)
    json.name = target.name
    writeJson(target.file, json)
  }
}

function renameStudioTitle(answers) {
  const file = path.join(root, 'studio', 'sanity.config.ts')
  if (!fs.existsSync(file)) return
  const source = fs.readFileSync(file, 'utf8')
  const updated = source.replace(
    /(\n\s*title:\s*)'[^']*'/,
    `$1'${answers.title.replace(/'/g, "\\'")}'`,
  )
  fs.writeFileSync(file, updated)
}

// Next.js reads dotenv files from web/, the Sanity CLI reads them from studio/.
const WEB_KEYS = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'NEXT_PUBLIC_SITE_URL',
  'SANITY_API_READ_TOKEN',
  'SANITY_REVALIDATE_SECRET',
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_POSTHOG_KEY',
  'NEXT_PUBLIC_POSTHOG_HOST',
]

const STUDIO_KEYS = [
  'SANITY_STUDIO_PROJECT_ID',
  'SANITY_STUDIO_DATASET',
  'SANITY_STUDIO_PREVIEW_ORIGIN',
]

function envValues(answers) {
  return {
    NEXT_PUBLIC_SANITY_PROJECT_ID: answers.projectId,
    NEXT_PUBLIC_SANITY_DATASET: answers.dataset,
    NEXT_PUBLIC_SITE_URL: answers.siteUrl,
    SANITY_STUDIO_PROJECT_ID: answers.projectId,
    SANITY_STUDIO_DATASET: answers.dataset,
    SANITY_STUDIO_PREVIEW_ORIGIN: 'http://localhost:3000',
  }
}

function parseExampleBlocks(source) {
  const blocks = []
  let comments = []
  for (const line of source.split('\n')) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line)
    if (match) {
      blocks.push({ key: match[1], value: match[2], comments })
      comments = []
      continue
    }
    if (!line.trim()) {
      comments = []
      continue
    }
    if (line.trim().startsWith('#')) comments.push(line)
  }
  return blocks
}

function renderEnvFile(blocks, keys, values) {
  const wanted = new Set(keys)
  const chunks = blocks
    .filter((block) => wanted.has(block.key))
    .map((block) => {
      const value = block.key in values ? values[block.key] : block.value
      return [...block.comments, `${block.key}=${value}`].join('\n')
    })
  return `${chunks.join('\n\n')}\n`
}

async function confirmOverwrite(target, flags) {
  if (!fs.existsSync(target)) return true
  const relative = path.relative(root, target)
  if (flags.yes) {
    console.warn(`Keeping the existing ${relative}.`)
    return false
  }
  const rl = createInterface({ input: stdin, output: stdout })
  const answer = (await rl.question(`${relative} already exists. Overwrite? (y/N): `)).trim()
  rl.close()
  if (answer.toLowerCase() === 'y') return true
  console.log(`Keeping the existing ${relative}.`)
  return false
}

async function writeEnvFiles(answers, flags) {
  const example = path.join(root, '.env.example')
  if (!fs.existsSync(example)) {
    console.warn('Skipping env files, .env.example is missing.')
    return
  }
  const blocks = parseExampleBlocks(fs.readFileSync(example, 'utf8'))
  const values = envValues(answers)

  const targets = [
    { file: path.join(root, 'web', '.env.local'), keys: WEB_KEYS },
    { file: path.join(root, 'studio', '.env'), keys: STUDIO_KEYS },
  ]

  for (const target of targets) {
    if (!fs.existsSync(path.dirname(target.file))) continue
    if (!(await confirmOverwrite(target.file, flags))) continue
    fs.writeFileSync(target.file, renderEnvFile(blocks, target.keys, values))
    console.log(`Wrote ${path.relative(root, target.file)}.`)
  }
}

function rewriteReadme(answers) {
  const file = path.join(root, 'README.md')
  if (!fs.existsSync(file)) return
  const source = fs.readFileSync(file, 'utf8')
  const updated = source.replace(/^#\s+.*$/m, `# ${answers.title}`)
  fs.writeFileSync(file, updated)
}

function walkTextFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      walkTextFiles(path.join(dir, entry.name), files)
      continue
    }
    if (!entry.isFile()) continue
    const extension = path.extname(entry.name)
    if (!TEXT_EXTENSIONS.has(extension) && entry.name !== '.env.example') continue
    if (entry.name === 'package-lock.json') continue
    files.push(path.join(dir, entry.name))
  }
  return files
}

function replacePlaceholder(answers) {
  let count = 0
  for (const file of walkTextFiles(root)) {
    if (file === scriptPath) continue
    const source = fs.readFileSync(file, 'utf8')
    if (!source.includes(PLACEHOLDER)) continue
    fs.writeFileSync(file, source.split(PLACEHOLDER).join(answers.name))
    count += 1
  }
  return count
}

function selfDestruct() {
  const file = path.join(root, 'package.json')
  if (fs.existsSync(file)) {
    const json = readJson(file)
    if (json.scripts && 'init' in json.scripts) {
      delete json.scripts.init
      writeJson(file, json)
    }
  }
  fs.rmSync(scriptPath, { force: true })
}

async function main() {
  const flags = parseArgs(process.argv.slice(2))
  const answers = await collect(flags)
  validate(answers)

  renamePackages(answers)
  renameStudioTitle(answers)
  await writeEnvFiles(answers, flags)
  rewriteReadme(answers)
  const replaced = replacePlaceholder(answers)

  console.log('')
  console.log(`Set up ${answers.title} (${answers.name}).`)
  console.log(`Sanity project ${answers.projectId}, dataset ${answers.dataset}.`)
  console.log(`Rewrote the boilerplate name in ${replaced} file(s).`)
  console.log('')
  console.log('Next steps:')
  console.log('  npx sanity login')
  console.log('  npx sanity cors add http://localhost:3000 --credentials')
  console.log('  npm run typegen')
  console.log('  npm run dev')
  console.log('')

  selfDestruct()
}

main().catch((error) => {
  fail(error?.message ?? String(error))
})

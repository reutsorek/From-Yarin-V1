#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const API_VERSION = '2026-08-16'
const DASH_PATTERN = /[‒–—―]/
const SKIPPED_KEYS = new Set(['_id', '_rev', '_type', '_key', '_createdAt', '_updatedAt'])
const QUERY = '*[!(_type match "system.**")]'

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const equals = line.indexOf('=')
    if (equals === -1) continue
    const key = line.slice(0, equals).trim()
    if (!key || key in process.env) continue
    let value = line.slice(equals + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function collectHits(value, trail, hits) {
  if (typeof value === 'string') {
    if (DASH_PATTERN.test(value)) hits.push({ path: trail.join('.') || 'document', value })
    return hits
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectHits(item, [...trail, String(index)], hits))
    return hits
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (SKIPPED_KEYS.has(key)) continue
      collectHits(child, [...trail, key], hits)
    }
  }
  return hits
}

function excerpt(value) {
  const single = value.replace(/\s+/g, ' ').trim()
  const index = single.search(DASH_PATTERN)
  const start = Math.max(0, index - 40)
  const slice = single.slice(start, start + 90)
  return `${start > 0 ? '...' : ''}${slice}${start + 90 < single.length ? '...' : ''}`
}

async function main() {
  loadEnvFile(path.join(root, 'web', '.env.local'))
  loadEnvFile(path.join(root, 'studio', '.env'))
  loadEnvFile(path.join(root, '.env'))

  const strict = process.argv.includes('--strict')
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'

  if (!projectId) {
    console.error(
      'No Sanity project id found. Set NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) in .env.local, .env, or the environment.',
    )
    process.exit(1)
  }

  const url = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(QUERY)}`
  const token = process.env.SANITY_API_READ_TOKEN
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  let payload
  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      const body = await response.text()
      console.error(`Sanity query failed with ${response.status}: ${body.slice(0, 300)}`)
      process.exit(1)
    }
    payload = await response.json()
  } catch (error) {
    console.error(`Could not reach the Sanity API: ${error?.message ?? String(error)}`)
    process.exit(1)
  }

  const documents = Array.isArray(payload?.result) ? payload.result : []
  let total = 0

  for (const document of documents) {
    const hits = collectHits(document, [], [])
    for (const hit of hits) {
      total += 1
      console.log(`${document?._id ?? 'unknown'}  ${hit.path}  "${excerpt(hit.value)}"`)
    }
  }

  console.log('')
  console.log(
    `Scanned ${documents.length} document(s) in ${projectId}/${dataset}. Found ${total} dash issue(s).`,
  )

  // Non-strict runs report only, so the audit can be advisory in a local workflow.
  if (total > 0 && strict) process.exit(1)
}

main().catch((error) => {
  console.error(error?.message ?? String(error))
  process.exit(1)
})

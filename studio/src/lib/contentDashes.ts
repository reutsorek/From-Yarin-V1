/**
 * Em/en dashes read as broken glyphs in Hebrew UI copy and are banned project-wide.
 * Enforced here at publish time so no editor has to remember the rule.
 */
export const DASH_PATTERN = /[‒–—―]/

const SKIPPED_KEYS = new Set(['_id', '_rev', '_type', '_key', '_createdAt', '_updatedAt'])

export interface DashHit {
  path: string
  value: string
}

export function findDashes(value: unknown, path: string[] = []): DashHit[] {
  if (typeof value === 'string') {
    return DASH_PATTERN.test(value) ? [{ path: path.join('.'), value }] : []
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findDashes(item, [...path, String(index)]))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      SKIPPED_KEYS.has(key) ? [] : findDashes(child, [...path, key]),
    )
  }
  return []
}

export function dashFreeDocument(doc: unknown): true | string {
  const hits = findDashes(doc)
  if (hits.length === 0) return true
  const where = hits
    .slice(0, 3)
    .map((hit) => hit.path || 'document')
    .join(', ')
  const more = hits.length > 3 ? ` and ${hits.length - 3} more` : ''
  return `Remove em/en dashes (use a comma, colon, or a separate sentence). Found in: ${where}${more}`
}

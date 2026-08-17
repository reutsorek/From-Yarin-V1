import { describe, expect, it } from 'vitest'

import { dashFreeDocument, findDashes } from '../../../../studio/src/lib/contentDashes'

describe('findDashes', () => {
  it('returns nothing for clean content', () => {
    expect(findDashes({ title: 'A clean title', body: 'No dashes here, only commas' })).toEqual([])
  })

  it('finds a dash in a nested object', () => {
    const hits = findDashes({ seo: { meta: { description: 'Fast — and simple' } } })
    expect(hits).toHaveLength(1)
    expect(hits[0].path).toBe('seo.meta.description')
    expect(hits[0].value).toContain('—')
  })

  it('finds dashes inside arrays and indexes them', () => {
    const hits = findDashes({ blocks: [{ heading: 'Fine' }, { heading: 'Broken – here' }] })
    expect(hits.map((hit) => hit.path)).toEqual(['blocks.1.heading'])
  })

  it('reports every dash variant', () => {
    const hits = findDashes(['a ‒ b', 'c – d', 'e — f', 'g ― h'])
    expect(hits).toHaveLength(4)
  })

  it('ignores system keys', () => {
    const hits = findDashes({
      _id: 'draft—123',
      _rev: 'a—b',
      _type: 'page—type',
      _key: 'k—1',
      _createdAt: '2026—01—01',
      _updatedAt: '2026—01—02',
      title: 'Clean title',
    })
    expect(hits).toEqual([])
  })

  it('ignores non string values', () => {
    expect(findDashes({ count: 3, live: true, missing: null })).toEqual([])
  })
})

describe('dashFreeDocument', () => {
  it('returns true for a clean document', () => {
    expect(dashFreeDocument({ title: 'All good' })).toBe(true)
  })

  it('returns a message naming the offending paths', () => {
    const result = dashFreeDocument({ title: 'Broken — title' })
    expect(typeof result).toBe('string')
    expect(result).toContain('title')
  })

  it('summarises when there are more than three hits', () => {
    const result = dashFreeDocument({
      a: 'x — y',
      b: 'x — y',
      c: 'x — y',
      d: 'x — y',
      e: 'x — y',
    })
    expect(result).toContain('and 2 more')
  })
})

import { describe, expect, it } from 'vitest'
import * as content from '@/content/report'
import { contents, figures, interstitials, terms, threads } from '@/content/report'
import { plateSrc } from '@/lib/plates'

const TERM_ORDER = ['wt1', 'wt2', 'wt3', 'wt4']
const GOAL_COUNTS = [3, 4, 4, 4]
const GOAL_STATES = ['met', 'partial', 'unmet']

describe('terms', () => {
  it('has exactly four terms, in order', () => {
    expect(terms).toHaveLength(4)
    expect(terms.map(t => t.id)).toEqual(TERM_ORDER)
  })

  it('carries the documented number of goals per term, fifteen in total', () => {
    expect(terms.map(t => t.goals.length)).toEqual(GOAL_COUNTS)
    expect(terms.reduce((n, t) => n + t.goals.length, 0)).toBe(15)
  })

  it('gives every goal a ref that is unique inside its own term', () => {
    for (const term of terms) {
      const refs = term.goals.map(g => g.ref)
      expect(new Set(refs).size, `duplicate goal ref in ${term.id}`).toBe(refs.length)
    }
  })

  it('records every goal state as met, partial or unmet', () => {
    for (const term of terms) {
      for (const goal of term.goals) {
        expect(GOAL_STATES, `${term.id} ${goal.ref}`).toContain(goal.state)
      }
    }
  })

  it('marks exactly one term as the latest, and it is the fourth', () => {
    const latest = terms.filter(t => t.isLatest)
    expect(latest).toHaveLength(1)
    expect(latest[0].id).toBe('wt4')
  })

  it('points every plate at a key that exists in plateSrc', () => {
    for (const term of terms) {
      expect(Object.keys(plateSrc), `${term.id} plate`).toContain(term.plate)
    }
  })

  it('carries no dead section field: section numbers are fixed in the components', () => {
    for (const term of terms) {
      expect('section' in term, `${term.id}`).toBe(false)
    }
  })
})

describe('threads', () => {
  it('has four entries, refs 5.1 to 5.4', () => {
    expect(threads).toHaveLength(4)
    expect(threads.map(t => t.ref)).toEqual(['5.1', '5.2', '5.3', '5.4'])
  })

  it('gives every thread one cell per term, in term order', () => {
    for (const thread of threads) {
      expect(thread.cells, `thread ${thread.ref}`).toHaveLength(4)
      expect(thread.cells.map(c => c.termId), `thread ${thread.ref}`).toEqual(TERM_ORDER)
    }
  })
})

describe('interstitials', () => {
  it('has exactly three, one after each of the first three terms', () => {
    expect(interstitials).toHaveLength(3)
    expect(interstitials.map(i => i.after)).toEqual(['wt1', 'wt2', 'wt3'])
  })

  it('has none after the fourth term', () => {
    expect(interstitials.some(i => (i.after as string) === 'wt4')).toBe(false)
  })
})

describe('front matter tables', () => {
  it('lists ten contents rows', () => {
    expect(contents).toHaveLength(10)
  })

  it('lists four figures', () => {
    expect(figures).toHaveLength(4)
  })
})

/* Em and en dashes were audited to zero and the audit is a project constraint, so this
   walks the exported values rather than the file text: a dash reintroduced through a
   template literal or a nested object would never show up in a source-text grep. */
describe('dash audit', () => {
  const DASHES = /[–—]/

  const offenders: string[] = []
  const seen = new WeakSet<object>()

  const walk = (value: unknown, path: string) => {
    if (typeof value === 'string') {
      if (DASHES.test(value)) offenders.push(`${path}: ${value}`)
      return
    }
    if (typeof value !== 'object' || value === null) return
    if (seen.has(value)) return
    seen.add(value)
    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${path}[${i}]`))
      return
    }
    for (const [key, item] of Object.entries(value)) walk(item, `${path}.${key}`)
  }

  for (const [name, value] of Object.entries(content)) walk(value, name)

  it('finds no em dash or en dash in any exported string', () => {
    expect(offenders).toEqual([])
  })
})

/* The prose cross-references a section or a goal by number, and the document has been
   renumbered under it more than once. This walks the exported values the same way the
   dash audit does, so a stale "Section N.N" is caught wherever it is written rather
   than only where somebody remembered to grep for it. */
describe('cross-references', () => {
  const SECTION_REF = /\bSection\s+(\d+\.\d+)\b/g

  const validIds = new Set<string>([
    ...contents.map(row => row.ref).filter(ref => /^\d+\.\d+$/.test(ref)),
    ...threads.map(t => t.ref),
    ...terms.flatMap(t => t.goals.map(g => g.ref)),
  ])

  const offenders: string[] = []
  const seen = new WeakSet<object>()

  const walk = (value: unknown, path: string) => {
    if (typeof value === 'string') {
      for (const match of value.matchAll(SECTION_REF)) {
        const id = match[1]
        if (!validIds.has(id)) offenders.push(`${path} references "Section ${id}", which does not exist: "${value}"`)
      }
      return
    }
    if (typeof value !== 'object' || value === null) return
    if (seen.has(value)) return
    seen.add(value)
    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${path}[${i}]`))
      return
    }
    for (const [key, item] of Object.entries(value)) walk(item, `${path}.${key}`)
  }

  for (const [name, value] of Object.entries(content)) walk(value, name)

  it('has at least one identifier to check against, so the guard is not vacuous', () => {
    expect(validIds.size).toBeGreaterThan(0)
  })

  it('points every "Section N.N" reference at a section or goal that actually exists', () => {
    expect(offenders).toEqual([])
  })
})

import type { AxeResults } from 'axe-core'
import { axe } from 'vitest-axe'
import { expect } from 'vitest'

/* One readable line per offending node. Asserting on the raw violation objects
   prints several hundred lines of axe internals and buries the finding. */
const summarise = (results: AxeResults) =>
  results.violations.flatMap(v =>
    v.nodes.map(n => `[${v.impact ?? 'unknown'}] ${v.id} at ${n.target.join(' ')}: ${v.help}`)
  )

/* The baseline is the whole rendered document, not a widget: the violations that
   matter in a single-page report are structural. Nothing is disabled here on top of
   the colour rules vitest-axe already turns off, because jsdom does not lay out and
   so cannot judge contrast. */
export async function expectA11yBaseline(container: HTMLElement) {
  const results = await axe(container)
  expect(summarise(results)).toEqual([])
  return results
}

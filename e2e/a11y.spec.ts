import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/* vitest-axe disables every cat.color rule because jsdom never lays out, so contrast is
   otherwise asserted nowhere. This runs axe in a real renderer instead, with colour rules
   left on rather than narrowed away, and only in chromium: three browsers agreeing on
   computed colour is not new information, and it triples the runtime for no signal. */
test.describe('colour contrast', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium',
      'axe contrast checking runs once, in chromium, to keep runtime sane'
    )
  })

  test('has no accessibility violations against the loaded page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('tab', { name: /Meridian Logistics/ })).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()

    const describe = (v: (typeof results.violations)[number]) =>
      v.nodes.map(n => `[${v.impact ?? 'unknown'}] ${v.id} at ${n.target.join(' ')}: ${n.failureSummary ?? v.help}`)

    const contrastViolations = results.violations.filter(v => v.id === 'color-contrast')
    const otherViolations = results.violations.filter(v => v.id !== 'color-contrast')

    expect(otherViolations.flatMap(describe), 'non-contrast violations found by the real renderer').toEqual([])
    expect(contrastViolations.flatMap(describe), 'colour-contrast violations, with the measured ratio').toEqual([])
  })
})

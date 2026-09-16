import { expect, test } from '@playwright/test'
import { threads } from '../src/content/report'

test.describe('at a 390px viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
  })

  /* A single overflowing element gives the whole document a horizontal scrollbar on a
     phone, which is the most visible way a typeset layout falls apart. */
  test('does not overflow horizontally', async ({ page }) => {
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    expect(scrollWidth).toBe(innerWidth)
  })

  test('replaces the progression table with one block per thread', async ({ page }) => {
    await expect(page.locator('table')).toBeHidden()

    const blocks = page.locator('#table-5-1').getByRole('heading', { level: 3 })
    await expect(blocks).toHaveCount(threads.length)
    expect(threads.length).toBe(4)
    for (let i = 0; i < threads.length; i += 1) {
      await expect(blocks.nth(i)).toBeVisible()
    }
  })

  test('stacks the chronology tiles in a single column', async ({ page }) => {
    const tabs = page.getByRole('tab')
    await expect(tabs).toHaveCount(4)

    const boxes = await tabs.evaluateAll(els =>
      els.map(el => {
        const r = el.getBoundingClientRect()
        return { x: Math.round(r.x), y: Math.round(r.y) }
      })
    )

    expect(new Set(boxes.map(b => b.x)).size).toBe(1)
    expect(new Set(boxes.map(b => b.y)).size).toBe(4)
  })
})

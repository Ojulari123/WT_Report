import { expect, test } from '@playwright/test'
import { fixedHeader, scrollPastCover } from './helpers'

test.describe('print', () => {
  test('drops the fixed header and keeps the document', async ({ page }) => {
    await page.goto('/')
    await page.emulateMedia({ media: 'print' })

    await expect(fixedHeader(page)).toHaveCSS('display', 'none')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('runs no term swap or progress animation, and still swaps the term', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('.term-swap')).toHaveCSS('animation-name', 'none')
    await expect(page.locator('.reading-progress')).toHaveCSS('animation-name', 'none')

    /* Inert in every engine, including the ones that take the JS fallback: that path
       checks the same media query and declines to attach, so no inline transform is ever
       written. Sampled over half a second, because "stays at zero" is a claim about a
       period and one read cannot tell it from a frame taken too early. */
    await scrollPastCover(page)
    await page.evaluate(() =>
      window.scrollTo({
        top: (document.documentElement.scrollHeight - window.innerHeight) * 0.6,
        behavior: 'instant',
      })
    )
    const bar = page.locator('.reading-progress')
    for (let i = 0; i < 5; i += 1) {
      await expect(bar).toHaveCSS('transform', 'matrix(0, 0, 0, 1, 0, 0)')
      expect(await bar.evaluate(el => (el as HTMLElement).style.transform)).toBe('')
      await page.waitForTimeout(100)
    }

    await page.getByRole('tab', { name: /Northview Health Network/ }).click()
    await expect(
      page.getByRole('heading', { name: 'Northview Health Network', level: 3 })
    ).toBeVisible()
    await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1)
  })
})

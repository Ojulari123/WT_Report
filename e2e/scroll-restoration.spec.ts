import { expect, test } from '@playwright/test'
import { expectLandsAtHeaderOffset, fontsReady, settleScroll } from './helpers'

/* WorkTermReportSite takes scroll restoration off the browser on mount and pins the load
   to the top, so a reload part way down opens the document rather than resuming it, and a
   hash in the URL is honoured instead because it is an explicit request for somewhere
   else. All three parts were verified in a browser once and never covered, which left the
   mechanism free to rot: 'manual' is a single line, and without it the browser quietly
   goes back to restoring the old offset. */
test.describe('landing position', () => {
  test('a reload part way down opens the document at the top', async ({ page }) => {
    await page.goto('/')
    await fontsReady(page)
    await page.evaluate(() => {
      window.scrollTo({ top: Math.round(window.innerHeight * 4), behavior: 'instant' })
    })
    await settleScroll(page)

    /* Asserted before the reload, not after: a test that reloads a page already sitting
       at the top proves nothing, so the travelled distance is established first. */
    const before = await page.evaluate(() => window.scrollY)
    expect(before, 'the document has to have been scrolled before the reload counts')
      .toBeGreaterThan(0)

    await page.reload()
    await fontsReady(page)
    await settleScroll(page)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)

    /* Read twice. A browser restore can land after hydration has already written 0, and a
       single early read would call that a pass. */
    await page.waitForTimeout(400)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('honours a hash in the URL rather than the top', async ({ page }) => {
    await page.goto('/#sec-5')
    await fontsReady(page)

    /* On the header offset rather than on a scroll position: the distance to section 5.0
       moves with every content edit, and what is being asserted is that the named target
       settled where a nav jump would have put it. */
    await expectLandsAtHeaderOffset(page, 'sec-5')
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
  })

  test('takes scroll restoration off the browser', async ({ page }) => {
    await page.goto('/')
    await fontsReady(page)
    expect(await page.evaluate(() => history.scrollRestoration)).toBe('manual')
  })
})

import { expect, test, type Page } from '@playwright/test'
import {
  contentsTermRow,
  expectLandsAtHeaderOffset,
  expectOnlySelectedTab,
  fontsReady,
  isOwnOrigin,
  scrollPastCover,
  settleScroll,
} from './helpers'

const appendixJump = (page: Page) =>
  page.locator('#contents').getByRole('button', { name: /Professional Log Summary/ })

test.describe('on load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('opens on the latest work term', async ({ page }) => {
    await expectOnlySelectedTab(page, 'wt4')
    await expect(page.getByRole('heading', { name: 'Meridian Logistics', level: 3 })).toBeVisible()
  })

  test('shows the ingestion figure, which belongs to the latest term', async ({ page }) => {
    await expect(page.locator('#figure-3-1')).toBeAttached()
  })
})

test.describe('term swaps', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('swap from a contents work term row', async ({ page }) => {
    await contentsTermRow(page, 'City of Guelph').click()

    await expectOnlySelectedTab(page, 'wt3')
    await expect(
      page.getByRole('heading', { name: 'City of Guelph, Open Data Programme', level: 3 })
    ).toBeVisible()
  })

  test('swap from a chronology tile', async ({ page }) => {
    await page.getByRole('tab', { name: /Latitude Systems/ }).click()

    await expectOnlySelectedTab(page, 'wt2')
    await expect(page.getByRole('heading', { name: 'Latitude Systems', level: 3 })).toBeVisible()
  })

  test('swap from a Table 5.1 column heading', async ({ page }) => {
    await page.getByRole('table').getByRole('button', { name: /Work Term 1/ }).click()

    await expectOnlySelectedTab(page, 'wt1')
    await expect(
      page.getByRole('heading', { name: 'Northview Health Network', level: 3 })
    ).toBeVisible()
  })

  test('shows the ingestion figure only for the latest term', async ({ page }) => {
    await expect(page.locator('#figure-3-1')).toBeAttached()

    await page.getByRole('tab', { name: /Northview Health Network/ }).click()
    await expect(page.locator('#figure-3-1')).toHaveCount(0)

    await page.getByRole('tab', { name: /Meridian Logistics/ }).click()
    await expect(page.locator('#figure-3-1')).toBeAttached()
  })

  test('brings the reader to section 2.0 of the term it loaded', async ({ page }) => {
    await fontsReady(page)
    await contentsTermRow(page, 'Latitude Systems').click()
    await expectLandsAtHeaderOffset(page, 'sec-2')
  })
})

test.describe('jump targets', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await fontsReady(page)
    await scrollPastCover(page)
  })

  const navJumps = [
    { label: 'Introduction', anchor: 'sec-1' },
    { label: 'Chronology', anchor: 'exhibit-a' },
    { label: 'Progression', anchor: 'sec-5' },
    { label: 'Conclusions', anchor: 'sec-6' },
  ]

  for (const { label, anchor } of navJumps) {
    test(`the ${label} nav jump lands under the header`, async ({ page }) => {
      await page.getByRole('banner').getByRole('button', { name: new RegExp(label) }).click()
      await expectLandsAtHeaderOffset(page, anchor)
    })
  }

  test('the appendix jump lands under the header when the document is long enough', async ({
    page,
  }) => {
    await appendixJump(page).click()
    await expectLandsAtHeaderOffset(page, 'appendix-a')
  })
})

test.describe('a jump past the end of the document', () => {
  /* Tall viewport on purpose: the appendix is the last section, so the only way its
     computed target can overshoot the document is for the viewport to eat the space
     below it. The precondition below fails loudly if the setup stops overshooting,
     rather than letting the clamp assertion pass for the wrong reason. */
  test.use({ viewport: { width: 1280, height: 1100 } })

  test('clamps to the bottom of the document', async ({ page }) => {
    await page.goto('/')
    await fontsReady(page)
    await scrollPastCover(page)

    const overshoot = await page.evaluate(() => {
      const el = document.getElementById('appendix-a')
      if (!el) throw new Error('no #appendix-a')
      const target = el.getBoundingClientRect().top + window.scrollY - 96
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      return target - maxScroll
    })
    expect(overshoot, 'the appendix target has to overshoot for this to test anything')
      .toBeGreaterThan(0)

    await appendixJump(page).click()
    await settleScroll(page)

    const { scrollY, maxScroll } = await page.evaluate(() => ({
      scrollY: window.scrollY,
      maxScroll: document.documentElement.scrollHeight - window.innerHeight,
    }))
    expect(Math.abs(scrollY - maxScroll), `scrollY ${scrollY}, max ${maxScroll}`)
      .toBeLessThanOrEqual(1)
  })
})

test.describe('the fixed header', () => {
  test('is hidden over the cover, revealed past it, and hidden again on return', async ({
    page,
  }) => {
    await page.goto('/')
    const banner = page.getByRole('banner')

    await expect(banner).toHaveCSS('opacity', '0')

    await scrollPastCover(page)
    await expect(banner).toHaveCSS('opacity', '1')

    /* An earlier version of this page left the header on screen after the reader
       returned to the cover, so this is the regression guard rather than a formality. */
    const backToTop = banner.getByRole('button', { name: /Adeoluwa Ojulari/ })
    await backToTop.click()
    await page.waitForFunction(() => window.scrollY === 0, undefined, { timeout: 300 })

    await expect(banner).toHaveCSS('opacity', '0')
  })
})

test.describe('cleanliness', () => {
  test('logs no console errors and no failed requests from its own origin on load', async ({
    page,
    baseURL,
  }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    const failures: string[] = []
    const thirdPartyFailures: string[] = []
    const origin = new URL(baseURL ?? 'http://localhost').origin

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', error => pageErrors.push(error.message))
    page.on('response', response => {
      if (response.status() < 400) return
      const line = `${response.status()} ${response.url()}`
      ;(isOwnOrigin(response.url(), origin) ? failures : thirdPartyFailures).push(line)
    })
    page.on('requestfailed', request => {
      const line = `failed ${request.url()} ${request.failure()?.errorText ?? ''}`
      ;(isOwnOrigin(request.url(), origin) ? failures : thirdPartyFailures).push(line)
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await expect(page.getByRole('tab', { name: /Meridian Logistics/ })).toBeVisible()

    /* TechMark's brand marks come from cdn.simpleicons.org, which this codebase does not
       control. A slow or unreachable CDN is reported here rather than failing the suite,
       so this test stays a signal about this application rather than about that CDN. */
    if (thirdPartyFailures.length > 0) {
      console.log(`third-party request failures, not asserted on: ${thirdPartyFailures.join('; ')}`)
    }

    expect(pageErrors).toEqual([])
    expect(consoleErrors).toEqual([])
    expect(failures).toEqual([])
  })

  test('does not let a broken third-party icon CDN mask a failure from its own origin', async ({
    page,
    baseURL,
  }) => {
    await page.route('https://cdn.simpleicons.org/**', route => route.abort('failed'))

    const failures: string[] = []
    const thirdPartyFailures: string[] = []
    const origin = new URL(baseURL ?? 'http://localhost').origin

    page.on('requestfailed', request => {
      const line = `failed ${request.url()} ${request.failure()?.errorText ?? ''}`
      ;(isOwnOrigin(request.url(), origin) ? failures : thirdPartyFailures).push(line)
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await expect(page.getByRole('tab', { name: /Meridian Logistics/ })).toBeVisible()

    expect(thirdPartyFailures.length, 'the aborted CDN requests should still be observed')
      .toBeGreaterThan(0)
    expect(failures).toEqual([])
  })

  /* The active-section head is driven by an IntersectionObserver and the progress bar by
     the CSS scroll timeline, so application code has no reason to listen for scroll. A
     listener fires on every frame of every scroll and was the reason an earlier build
     janked on the term swap. The one sanctioned exception is the progress-bar fallback in
     engines without scroll-driven animation, which is why the budget below is one there
     and zero everywhere else, rather than unbounded. */
  test('registers no unsanctioned scroll listener from application code', async ({
    page,
    request,
  }) => {
    await page.addInitScript(() => {
      const w = window as typeof window & { __scrollListeners?: string[] }
      w.__scrollListeners = []
      Error.stackTraceLimit = 50
      const original = EventTarget.prototype.addEventListener
      EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (type === 'scroll') {
          w.__scrollListeners?.push(new Error('scroll listener').stack ?? 'no stack')
        }
        return original.call(this, type, listener, options)
      }
    })

    await page.goto('/')
    await expect(page.getByRole('tab', { name: /Meridian Logistics/ })).toBeVisible()
    await scrollPastCover(page)
    await page.getByRole('tab', { name: /Latitude Systems/ }).click()
    await settleScroll(page)

    const stacks = await page.evaluate(
      () => (window as typeof window & { __scrollListeners?: string[] }).__scrollListeners ?? []
    )

    /* React's event delegation registers scroll on the hydration root, so the question
       is not whether any listener exists but whose bundle asked for it. The chunk
       carrying this app's client components is found by its own markup, then every
       recorded stack is checked against it. */
    const scripts = await page.evaluate(() =>
      [...document.querySelectorAll('script[src]')].map(s => (s as HTMLScriptElement).src)
    )
    const appChunks: string[] = []
    for (const url of scripts) {
      const body = await (await request.get(url)).text()
      if (body.includes('reading-progress') && body.includes('Still open')) appChunks.push(url)
    }
    expect(appChunks.length, 'could not find the application chunk, so nothing was proven')
      .toBeGreaterThan(0)

    const fromApp = stacks.filter(stack => appChunks.some(chunk => stack.includes(chunk)))

    const supported = await page.evaluate(() =>
      CSS.supports('animation-timeline', 'scroll()')
    )
    const budget = supported ? 0 : 1
    expect(
      fromApp.length,
      `expected ${budget} scroll listener from application code (scroll-driven animation ` +
        `supported: ${supported}) but found ${fromApp.length}:\n${fromApp.join('\n---\n')}`
    ).toBe(budget)
  })
})

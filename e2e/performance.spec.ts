import { expect, test } from '@playwright/test'
import { isOwnOrigin, settleScroll } from './helpers'

/* Left at 300 KiB rather than lowered: TechMark's brand marks (cdn.simpleicons.org) are
   excluded below because this budget is this application's own asset weight, not a
   third party's, and those marks are a handful of 13px SVGs, a few hundred bytes each.
   Their removal does not shrink the budget enough to need tightening against the plates,
   which are two orders of magnitude larger and remain the thing this guards against. */
const IMAGE_BUDGET_BYTES = 300 * 1024

test.describe('image weight', () => {
  /* The four plates shipped at 3,175,718 B as raw files and came down to 39,628 B
     through next/image. The budget sits far below the unoptimised figure and well
     above the optimised one, so it fails if the plates are ever served raw again. */
  test('keeps every image on the page inside the budget', async ({ page, baseURL }) => {
    const images: { url: string; bytes: number }[] = []
    const origin = new URL(baseURL ?? 'http://localhost').origin

    page.on('response', async response => {
      if (response.request().resourceType() !== 'image') return
      /* Third-party brand marks are not this application's asset weight, and a slow or
         unreachable CDN should not make this budget flaky for a reason unrelated to it. */
      if (!isOwnOrigin(response.url(), origin)) return
      const declared = Number(response.headers()['content-length'] ?? Number.NaN)
      if (Number.isFinite(declared)) {
        images.push({ url: response.url(), bytes: declared })
        return
      }
      try {
        images.push({ url: response.url(), bytes: (await response.body()).length })
      } catch {
        /* response body no longer available; ignore rather than undercount silently */
      }
    })

    await page.goto('/')

    /* The plates are lazy, so a budget measured without walking the document would
       measure almost nothing and pass for the wrong reason. WebKit will not start a
       lazy load for an image a fast scroll skipped past, so every image is brought
       into view and then waited on. */
    const steps = await page.evaluate(() =>
      Math.ceil(document.documentElement.scrollHeight / window.innerHeight)
    )
    for (let i = 0; i <= steps; i += 1) {
      await page.evaluate(
        n => window.scrollTo({ top: n * window.innerHeight, behavior: 'instant' }),
        i
      )
      await settleScroll(page)
    }

    const imgs = page.locator('img')
    const imgCount = await imgs.count()
    for (let i = 0; i < imgCount; i += 1) {
      await imgs.nth(i).scrollIntoViewIfNeeded()
    }
    await page.waitForFunction(() => [...document.images].every(img => img.complete))
    await page.waitForLoadState('networkidle')

    const total = images.reduce((sum, i) => sum + i.bytes, 0)
    const plates = images.filter(i => /_next\/image|\.(jpe?g|png|webp|avif)/.test(i.url))

    const plateBytes = plates.reduce((sum, i) => sum + i.bytes, 0)
    console.log(
      `image responses: ${images.length}, total ${total} B ` +
        `(plates ${plates.length} responses, ${plateBytes} B), budget ${IMAGE_BUDGET_BYTES} B`
    )

    expect(plates.length, 'no plate was ever requested, so the budget is meaningless')
      .toBeGreaterThanOrEqual(4)
    expect(total).toBeGreaterThan(0)
    expect(total).toBeLessThan(IMAGE_BUDGET_BYTES)
  })
})

test.describe('reading progress bar', () => {
  /* The bar is driven by the CSS scroll timeline where that exists and by a passive
     rAF-coalesced fallback where it does not, so the claim is now the same in every
     engine: it tracks the scroll and never overruns full width. This replaces an earlier
     test that asserted the bar stays flat without scroll-timeline support, which encoded
     the superseded intent of letting it degrade to nothing in Firefox. */
  test('advances with the scroll in every engine and never passes full width', async ({
    page,
  }) => {
    await page.goto('/')
    const bar = page.locator('.reading-progress')

    const supported = await page.evaluate(() =>
      CSS.supports('animation-timeline', 'scroll()')
    )
    console.log(`scroll-driven animation supported: ${supported}`)

    /* Read as a matrix component rather than a string, because the two paths produce the
       same geometry through different declarations. An identity transform reads as 1 and
       is deliberately not special-cased away: a bar stuck at full width is a failure. */
    const scaleX = () =>
      bar.evaluate(el => {
        const t = getComputedStyle(el).transform
        return t === 'none' ? 1 : new DOMMatrixReadOnly(t).a
      })

    expect(await scaleX(), 'unscrolled, so the bar must start empty').toBeLessThan(0.05)

    await page.evaluate(() =>
      window.scrollTo({
        top: (document.documentElement.scrollHeight - window.innerHeight) * 0.5,
        behavior: 'instant',
      })
    )
    await settleScroll(page)

    /* Polled rather than read once: both paths update on a rendering opportunity, which
       under load is not the next 60ms. */
    await expect
      .poll(scaleX, { message: 'at mid document the bar must have advanced', timeout: 5_000 })
      .toBeGreaterThan(0.3)
    const mid = await scaleX()
    expect(mid, `mid-document scaleX was ${mid}, expected roughly half`).toBeLessThan(0.7)
    console.log(`mid-document scaleX: ${mid}`)

    await page.evaluate(() =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
    )
    await settleScroll(page)

    await expect
      .poll(scaleX, { message: 'at the foot of the document the bar must be full', timeout: 5_000 })
      .toBeGreaterThan(0.97)
    const end = await scaleX()
    expect(end, `bottom scaleX was ${end}, which overruns full width`).toBeLessThanOrEqual(1)
    console.log(`bottom scaleX: ${end}`)

    /* The fallback writes the transform inline, so an empty inline style is proof that the
       engines with a scroll timeline never paid for it. */
    const inline = await bar.evaluate(el => (el as HTMLElement).style.transform)
    if (supported) {
      expect(inline, 'CSS drives the bar here, so no fallback may have written to it').toBe('')
    } else {
      expect(inline, 'no scroll timeline here, so the fallback must have written the value')
        .not.toBe('')
    }

    await expect(page.getByRole('tab', { name: /Meridian Logistics/ })).toBeVisible()
  })
})

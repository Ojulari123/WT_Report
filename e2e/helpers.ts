import { expect, type Locator, type Page } from '@playwright/test'

export const HEADER_OFFSET = 96

export type TermId = 'wt1' | 'wt2' | 'wt3' | 'wt4'

export const LATEST_TERM: TermId = 'wt4'

/* The four employer names live here and nowhere else. A content edit renamed all four at
   once and broke thirty-seven locators, because every spec carried its own literal; a
   spec now names a term and this table resolves it. Held as literals rather than read
   from the content module on purpose, so the assertions still check the page against a
   stated fact instead of against whatever the page was built from. */
export const STUDENT_NAME = 'Adeoluwa Jason Ojulari'

export const employerName: Record<TermId, string> = {
  wt1: 'RAA I.T.',
  wt2: 'JREN Energy Inc.',
  wt3: 'Badger Redwood Inc.',
  wt4: 'Value-N-Action Consulting',
}

/* Jumps use smooth behaviour for short distances, so every position assertion has to
   wait for the animation to stop moving rather than for a fixed delay. Sampled on a
   timer rather than per frame: Firefox's smooth scroll crawls the last pixel or two in
   sub-frame increments, which a frame-to-frame comparison reads as already stopped. */
export async function settleScroll(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>(resolve => {
        let last = window.scrollY
        let stable = 0
        const check = () => {
          const now = window.scrollY
          if (Math.abs(now - last) < 0.5) stable += 1
          else stable = 0
          last = now
          if (stable >= 3) resolve()
          else setTimeout(check, 60)
        }
        setTimeout(check, 60)
      })
  )
}

/* The webfonts swap in after first paint and move the text by about a pixel, so a
   pixel-exact scroll assertion taken before they land measures the fallback metrics. */
export async function fontsReady(page: Page) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
}

export async function topOf(page: Page, id: string) {
  return page.evaluate(anchor => {
    const el = document.getElementById(anchor)
    if (!el) throw new Error(`no element #${anchor}`)
    return el.getBoundingClientRect().top
  }, id)
}

/* One pixel of tolerance, because a fractional device pixel ratio leaves the settled
   offset a fraction short of 96 in WebKit. */
export async function expectLandsAtHeaderOffset(page: Page, id: string) {
  await settleScroll(page)
  const top = await topOf(page, id)
  expect(Math.abs(top - HEADER_OFFSET), `#${id} settled at ${top}, expected ${HEADER_OFFSET}`)
    .toBeLessThanOrEqual(1)
}

export async function scrollPastCover(page: Page) {
  await page.evaluate(() => {
    window.scrollTo({ top: Math.round(window.innerHeight * 1.5), behavior: 'instant' })
  })
  await settleScroll(page)
}

export async function selectedTabIds(page: Page) {
  return page.locator('[role="tab"][aria-selected="true"]').evaluateAll(els =>
    els.map(el => el.id)
  )
}

export async function expectOnlySelectedTab(page: Page, termId: string) {
  await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1)
  expect(await selectedTabIds(page)).toEqual([`tab-${termId}`])
}

/* Queried by element rather than by the banner role, because the print stylesheet sets
   display: none and a display: none element is not in the accessibility tree at all. */
export function fixedHeader(page: Page): Locator {
  return page.locator('header').first()
}

/* Matched as a string with exact: false rather than as a regex, because "RAA I.T."
   carries regex metacharacters, and the accessible name of a row or a tile is longer than
   the employer name inside it, so the match has to be a substring one. */
export function contentsTermRow(page: Page, term: TermId): Locator {
  return page.locator('#contents').getByRole('button', { name: employerName[term], exact: false })
}

export function chronologyTab(page: Page, term: TermId): Locator {
  return page.getByRole('tab', { name: employerName[term], exact: false })
}

/* The employer name is the section 2.0 heading, so this is what shows which term loaded. */
export function employerHeading(page: Page, term: TermId): Locator {
  return page.getByRole('heading', { name: employerName[term], level: 3 })
}

/* TechMark loads brand marks from cdn.simpleicons.org, a third party this codebase does
   not control. The cleanliness check needs to keep failing on a failure this application
   caused while no longer failing on one a remote CDN caused, and that split is this
   comparison rather than a hardcoded host, so it holds if the app's own origin changes. */
export function isOwnOrigin(url: string, origin: string): boolean {
  try {
    return new URL(url).origin === origin
  } catch {
    return false
  }
}

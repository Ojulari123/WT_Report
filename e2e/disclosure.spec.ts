import { expect, test, type Locator, type Page } from '@playwright/test'

/* The goal disclosures are the only toggles in the document that carry aria-expanded, so a
   closed one is reachable by role alone and no locator here names a goal or an id that a
   content edit could move.

   Found by role and then pinned to the panel it controls, because the role locator is
   live: it stops matching the instant that panel opens and slides onto the next goal
   still closed, where an assertion on aria-expanded reads false and looks like a bug in
   the component. */
async function closedDisclosure(page: Page): Promise<{ toggle: Locator; panelId: string }> {
  const found = page.getByRole('button', { expanded: false }).first()
  const panelId = await found.getAttribute('aria-controls')
  expect(panelId, 'a disclosure toggle has to name the panel it controls').toBeTruthy()
  return { toggle: page.locator(`button[aria-controls="${panelId}"]`), panelId: panelId as string }
}

/* The panel height read once per frame from the click onward. Sampled in the page rather
   than over the wire, because a round trip per sample is slower than the 240ms ramp and
   would only ever catch the endpoints. */
async function heightsWhileOpening(page: Page, panelId: string): Promise<number[]> {
  return page.evaluate(async id => {
    const panel = document.getElementById(id)
    if (!panel) throw new Error(`no panel #${id}`)
    const toggle = document.querySelector<HTMLButtonElement>(`button[aria-controls="${id}"]`)
    if (!toggle) throw new Error(`no toggle for #${id}`)

    const samples = [panel.getBoundingClientRect().height]
    toggle.click()
    await new Promise<void>(resolve => {
      const started = performance.now()
      const tick = () => {
        samples.push(panel.getBoundingClientRect().height)
        if (performance.now() - started < 400) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    })
    return samples
  }, panelId)
}

async function panelHeight(page: Page, panelId: string): Promise<number> {
  return page.evaluate(id => {
    const panel = document.getElementById(id)
    if (!panel) throw new Error(`no panel #${id}`)
    return panel.getBoundingClientRect().height
  }, panelId)
}

test.describe('goal disclosures', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready.then(() => undefined))
  })

  /* A snap and a 240ms ramp both end with an open panel, so an assertion on the endpoints
     cannot tell them apart. What separates them is the middle: the ramp has to be caught
     holding a height that is neither closed nor open. */
  test('opens on a ramp rather than a snap', async ({ page }) => {
    const { toggle, panelId } = await closedDisclosure(page)

    const samples = await heightsWhileOpening(page, panelId)
    const trace = samples.map(h => h.toFixed(1)).join(' ')
    const open = samples[samples.length - 1]

    expect(samples[0], `started open. ${trace}`).toBe(0)
    expect(open, `never opened. ${trace}`).toBeGreaterThan(0)

    const midway = samples.filter(h => h > 0.5 && h < open - 0.5)
    expect(midway.length, `no intermediate height, so it snapped. ${trace}`).toBeGreaterThan(0)

    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  })

  /* visibility: hidden rather than a collapsed height, because a link inside a zero height
     overflow-hidden box is still focusable and still tabbable. The panels carry no
     focusable content today, so one is injected: the assertion has to keep failing if the
     mechanism is ever swapped for a plain height of zero, and a panel with nothing
     focusable in it would pass either way. */
  test('refuses focus to content inside a closed panel', async ({ page }) => {
    const { toggle, panelId } = await closedDisclosure(page)
    const panel = page.locator(`#${panelId}`)

    await expect(panel).toHaveCSS('visibility', 'hidden')

    const focusedId = await page.evaluate(id => {
      const panel = document.getElementById(id)
      if (!panel) throw new Error(`no panel #${id}`)
      const body = panel.querySelector('div > div')
      if (!body) throw new Error(`no panel body in #${id}`)
      const link = document.createElement('a')
      link.id = 'focus-probe'
      link.href = '#focus-probe'
      link.textContent = 'Focus probe'
      body.append(link)
      link.focus()
      return document.activeElement instanceof HTMLElement ? document.activeElement.id : ''
    }, panelId)
    expect(focusedId, 'a closed panel handed focus to its content').not.toBe('focus-probe')

    await toggle.focus()
    await page.keyboard.press('Tab')
    const tabbedInto = await page.evaluate(id => {
      const panel = document.getElementById(id)
      if (!panel) throw new Error(`no panel #${id}`)
      return panel.contains(document.activeElement)
    }, panelId)
    expect(tabbedInto, 'Tab from the toggle landed inside the closed panel').toBe(false)
  })

  /* An earlier cut of this leaked 24px per closed goal, because min-height: 0 collapses the
     row but does not reach the padding on the box it applies to. Nothing in the stylesheet
     guards it, so it is guarded here, measured. */
  test('gives a closed panel no height at all', async ({ page }) => {
    const { toggle, panelId } = await closedDisclosure(page)
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    expect(await panelHeight(page, panelId)).toBe(0)
    expect(
      await page.evaluate(id => {
        const clipper = document.getElementById(id)?.firstElementChild
        if (!clipper) throw new Error(`no clipping wrapper in #${id}`)
        return clipper.getBoundingClientRect().height
      }, panelId)
    ).toBe(0)
  })

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' })

    test('drops the ramp and still opens and closes', async ({ page }) => {
      const { toggle, panelId } = await closedDisclosure(page)

      const samples = await heightsWhileOpening(page, panelId)
      const trace = samples.map(h => h.toFixed(1)).join(' ')
      const open = samples[samples.length - 1]

      expect(open, `never opened. ${trace}`).toBeGreaterThan(0)
      const midway = samples.filter(h => h > 0.5 && h < open - 0.5)
      expect(midway, `animated under reduced motion. ${trace}`).toEqual([])

      await expect(toggle).toHaveAttribute('aria-expanded', 'true')

      await toggle.click()
      await expect(toggle).toHaveAttribute('aria-expanded', 'false')

      /* Polled rather than read straight after the click. Reduced motion shortens the
         transition to 0.01ms, it does not remove it, and a transition that has just
         started still reports its start value, so the collapse lands on the next frame
         rather than in the same one. */
      await expect.poll(() => panelHeight(page, panelId)).toBe(0)
    })
  })
})

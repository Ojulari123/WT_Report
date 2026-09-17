import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Disclosure, StateMark, TechMark } from '@/components/report/DocPrimitives'
import { stateLabel } from '@/content/report'

const panelOf = (button: HTMLElement) => {
  const id = button.getAttribute('aria-controls')
  expect(id, 'the toggle must point at its panel').toBeTruthy()
  return document.getElementById(id as string)
}

describe('StateMark', () => {
  it.each([
    ['met', 'Met'],
    ['partial', 'Partially met'],
    ['unmet', 'Unmet'],
    ['na', 'Not applicable'],
  ] as const)('labels the %s state as "%s"', (state, label) => {
    render(<StateMark state={state} />)
    expect(screen.getByText(label)).toBeInTheDocument()
    expect(label).toBe(stateLabel[state])
  })
})

/* The panel is no longer closed with the native hidden attribute, because display: none
   cannot be transitioned. Closed now means two things, and both are asserted here: an
   inline visibility: hidden, which is what holds the content out of the accessibility
   tree and out of the tab order, and the absence of .disclosure-panel-open, which is the
   class that carries grid-template-rows: 1fr and opacity: 1. The visibility is written
   inline by the component rather than in the stylesheet precisely so that this suite,
   which loads no CSS, can hold it to the same standard the hidden attribute was held to. */
describe('Disclosure', () => {
  it('starts closed, with the panel hidden from the accessibility tree and unopened', () => {
    render(
      <Disclosure id="goal-panel" summary="Own a feature end to end">
        <p>Panel body</p>
      </Disclosure>
    )

    const toggle = screen.getByRole('button', { name: /Own a feature end to end/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(panelOf(toggle)).toHaveStyle({ visibility: 'hidden' })
    expect(panelOf(toggle)).not.toHaveClass('disclosure-panel-open')
    expect(screen.getByText('Panel body')).not.toBeVisible()
  })

  it('starts open when defaultOpen is set', () => {
    render(
      <Disclosure id="goal-panel" summary="Own a feature end to end" defaultOpen>
        <p>Panel body</p>
      </Disclosure>
    )

    const toggle = screen.getByRole('button', { name: /Own a feature end to end/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(panelOf(toggle)).toHaveStyle({ visibility: 'visible' })
    expect(panelOf(toggle)).toHaveClass('disclosure-panel-open')
    expect(screen.getByText('Panel body')).toBeVisible()
  })

  it('toggles aria-expanded, the panel visibility and the open class together on click', async () => {
    const user = userEvent.setup()
    render(
      <Disclosure id="goal-panel" summary="Own a feature end to end">
        <p>Panel body</p>
      </Disclosure>
    )

    const toggle = screen.getByRole('button', { name: /Own a feature end to end/ })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(panelOf(toggle)).toHaveStyle({ visibility: 'visible' })
    expect(panelOf(toggle)).toHaveClass('disclosure-panel-open')
    expect(screen.getByText('Panel body')).toBeVisible()

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(panelOf(toggle)).toHaveStyle({ visibility: 'hidden' })
    expect(panelOf(toggle)).not.toHaveClass('disclosure-panel-open')
    expect(screen.getByText('Panel body')).not.toBeVisible()
  })

  /* An earlier cut of the panel left 24px of dead space under every closed goal. The
     clipping wrapper is the box min-height: 0 and overflow: hidden apply to, and padding
     sits outside that box, so any vertical padding on the clipper survives the collapse
     and holds the row open at exactly that height. The collapsed height itself is measured
     in e2e/disclosure.spec.ts, which lays out; what is held here is the two-wrapper shape
     that makes the collapse possible, since moving the padding up one level is the edit
     that reintroduces the leak. */
  it('keeps vertical padding off the clipping wrapper, one level further in', () => {
    render(
      <Disclosure id="goal-panel" summary="Own a feature end to end">
        <p>Panel body</p>
      </Disclosure>
    )

    const panel = panelOf(screen.getByRole('button', { name: /Own a feature end to end/ }))
    const clipper = panel?.firstElementChild
    expect(panel?.children).toHaveLength(1)
    expect(clipper?.children).toHaveLength(1)

    /* pl- and pr- are left alone on purpose: horizontal padding cannot hold a collapsed
       row open, and the indent to the summary's left edge lives on the inner wrapper. */
    const verticalPadding = /(^|\s)-?p[bty]?-/
    expect(clipper?.className ?? '').not.toMatch(verticalPadding)
    expect(clipper?.firstElementChild?.className ?? '').toMatch(verticalPadding)
  })
})

describe('TechMark', () => {
  it('renders the technology name', () => {
    render(<TechMark name="PostgreSQL" slug="postgresql" />)
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument()
  })

  /* Two of the first term's technologies have no Simple Icons slug. Requesting
     cdn.simpleicons.org// is a guaranteed 404 on every page view. */
  it('requests no icon at all when the slug is empty', () => {
    const { container } = render(<TechMark name="PowerShell" slug="" />)

    expect(screen.getByText('PowerShell')).toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(0)
    expect(container.innerHTML).not.toContain('simpleicons')
  })

  it('requests the icon for the given slug when one is present', () => {
    const { container } = render(<TechMark name="Go" slug="go" />)

    const icon = container.querySelector('img')
    expect(icon).not.toBeNull()
    expect(icon).toHaveAttribute('src', expect.stringContaining('/go/'))
    expect(icon).toHaveAttribute('alt', '')
  })
})

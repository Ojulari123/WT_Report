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

describe('Disclosure', () => {
  it('starts closed, with the panel carrying the native hidden attribute', () => {
    render(
      <Disclosure id="goal-panel" summary="Own a feature end to end">
        <p>Panel body</p>
      </Disclosure>
    )

    const toggle = screen.getByRole('button', { name: /Own a feature end to end/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(panelOf(toggle)).toHaveAttribute('hidden')
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
    expect(panelOf(toggle)).not.toHaveAttribute('hidden')
    expect(screen.getByText('Panel body')).toBeVisible()
  })

  it('toggles aria-expanded and the hidden panel together on click', async () => {
    const user = userEvent.setup()
    render(
      <Disclosure id="goal-panel" summary="Own a feature end to end">
        <p>Panel body</p>
      </Disclosure>
    )

    const toggle = screen.getByRole('button', { name: /Own a feature end to end/ })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(panelOf(toggle)).not.toHaveAttribute('hidden')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(panelOf(toggle)).toHaveAttribute('hidden')
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

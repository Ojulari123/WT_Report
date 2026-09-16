import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { WorkTermReportSite } from '@/components/report/WorkTermReportSite'
import { expectA11yBaseline } from './axe'

describe('accessibility baseline', () => {
  /* Scoped to the whole body rather than the render container so the page-level
     rules run too: the cover sits outside <main>, and only a body-scope pass
     notices that its content is in no landmark at all. */
  it('has no axe violations on load', async () => {
    render(<WorkTermReportSite />)
    await expectA11yBaseline(document.body)
  }, 30_000)

  it('has no axe violations with a goal disclosure open', async () => {
    const user = userEvent.setup()
    render(<WorkTermReportSite />)

    const goal = screen.getByRole('button', { name: /Write tests that other engineers depend on/ })
    await user.click(goal)
    expect(goal).toHaveAttribute('aria-expanded', 'true')

    await expectA11yBaseline(document.body)
  }, 30_000)

  it('gives the document exactly one level one heading', () => {
    render(<WorkTermReportSite />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})

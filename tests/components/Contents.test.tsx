import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Contents } from '@/components/report/Contents'
import { contents, figures, terms } from '@/content/report'

const setup = () => {
  const onJump = vi.fn()
  const onSelectTerm = vi.fn()
  render(<Contents activeTermId="wt4" onJump={onJump} onSelectTerm={onSelectTerm} />)
  return { onJump, onSelectTerm, user: userEvent.setup() }
}

/* The three lists carry overlapping wording, so every query is scoped to the list
   under its own heading rather than run against the whole component. */
const listUnder = (heading: string) => {
  const list = screen.getByRole('heading', { name: heading }).parentElement?.querySelector('ol')
  expect(list, `no list under the ${heading} heading`).toBeTruthy()
  return list as HTMLElement
}

describe('Contents', () => {
  it('renders a row for every work term', () => {
    setup()
    const rows = within(listUnder('Work terms')).getAllByRole('listitem')
    expect(rows).toHaveLength(terms.length)
    for (const term of terms) {
      expect(within(listUnder('Work terms')).getByText(term.employer.name)).toBeInTheDocument()
    }
  })

  it.each(terms.map(t => [t.employer.name, t.id]))(
    'selects the term behind the %s row',
    async (employer, id) => {
      const { onSelectTerm, user } = setup()
      await user.click(within(listUnder('Work terms')).getByRole('button', { name: new RegExp(employer) }))
      expect(onSelectTerm).toHaveBeenCalledWith(id)
      expect(onSelectTerm).toHaveBeenCalledTimes(1)
    }
  )

  it('marks the loaded term as current', () => {
    setup()
    const current = within(listUnder('Work terms'))
      .getAllByRole('button')
      .filter(b => b.getAttribute('aria-current') === 'true')
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent('Value-N-Action Consulting')
  })

  it.each(contents.map(row => [row.title, row.anchor]))(
    'jumps to %s',
    async (title, anchor) => {
      const { onJump, user } = setup()
      await user.click(within(listUnder('Contents')).getByRole('button', { name: new RegExp(title) }))
      expect(onJump).toHaveBeenCalledWith(anchor)
      expect(onJump).toHaveBeenCalledTimes(1)
    }
  )

  it.each(figures.map(row => [row.ref, row.anchor]))(
    'jumps to the %s row in the figure list',
    async (ref, anchor) => {
      const { onJump, user } = setup()
      await user.click(within(listUnder('Figures and tables')).getByRole('button', { name: new RegExp(ref) }))
      expect(onJump).toHaveBeenCalledWith(anchor)
      expect(onJump).toHaveBeenCalledTimes(1)
    }
  )
})

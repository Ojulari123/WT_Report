import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProgressionTable } from '@/components/report/ProgressionTable'
import { terms, threads } from '@/content/report'

const setup = () => {
  const onSelectTerm = vi.fn()
  render(<ProgressionTable onSelectTerm={onSelectTerm} />)
  return { onSelectTerm, table: screen.getByRole('table'), user: userEvent.setup() }
}

const bodyRows = (table: HTMLElement) => {
  const groups = within(table).getAllByRole('rowgroup')
  const body = groups[groups.length - 1]
  return within(body).getAllByRole('row')
}

describe('ProgressionTable', () => {
  it('captions the table', () => {
    const { table } = setup()
    const caption = table.querySelector('caption')
    expect(caption).not.toBeNull()
    expect(caption?.textContent?.trim()).not.toBe('')
  })

  it('heads one column per work term, in term order', () => {
    const { table } = setup()
    const headers = within(table)
      .getAllByRole('columnheader')
      .filter(h => within(h).queryByRole('button') !== null)

    expect(headers).toHaveLength(4)
    expect(headers.map(h => within(h).getByRole('button').textContent)).toEqual(
      terms.map(t => expect.stringContaining(t.label))
    )
  })

  it('gives every recurring goal one body row', () => {
    const { table } = setup()
    expect(bodyRows(table)).toHaveLength(4)
    expect(bodyRows(table)).toHaveLength(threads.length)
  })

  it.each(terms.map(t => [t.label, t.id]))(
    'loads %s when its column heading is activated',
    async (label, id) => {
      const { onSelectTerm, table, user } = setup()
      await user.click(within(table).getByRole('button', { name: new RegExp(label) }))
      expect(onSelectTerm).toHaveBeenCalledWith(id)
      expect(onSelectTerm).toHaveBeenCalledTimes(1)
    }
  )

  /* The marker is the table's only claim about the reader's takeaway, so it has to
     track the final cell rather than a hand-maintained flag. */
  it.each(threads.map(t => [t.ref, t.title, t.cells[t.cells.length - 1].state]))(
    'marks thread %s as still open only when its final state is not met',
    async (ref, title, finalState) => {
      const { table } = setup()
      const row = bodyRows(table).find(r => within(r).queryByText(title as string) !== null)
      expect(row, `no row for thread ${ref}`).toBeTruthy()

      const marker = within(row as HTMLElement).queryByText('Still open')
      if (finalState === 'met') {
        expect(marker).toBeNull()
      } else {
        expect(marker).not.toBeNull()
      }
    }
  )

  it('shows the still open marker exactly as often as a thread ends unmet or partial', () => {
    const { table } = setup()
    const expected = threads.filter(t => t.cells[t.cells.length - 1].state !== 'met').length
    expect(within(table).queryAllByText('Still open')).toHaveLength(expected)
  })
})

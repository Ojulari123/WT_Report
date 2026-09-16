import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Chronology } from '@/components/report/Chronology'
import { stateLabel, terms } from '@/content/report'

const renderAt = (activeId: string) => {
  const onSelect = vi.fn()
  render(<Chronology terms={terms} activeId={activeId} onSelect={onSelect} />)
  const tablist = screen.getByRole('tablist')
  const tabs = within(tablist).getAllByRole('tab')
  return { onSelect, tablist, tabs }
}

const pressOn = async (tabs: HTMLElement[], activeIndex: number, key: string) => {
  const user = userEvent.setup()
  tabs[activeIndex].focus()
  await user.keyboard(key)
}

describe('Chronology', () => {
  it('renders one tab per term inside a tablist', () => {
    const { tabs } = renderAt('wt4')
    expect(tabs).toHaveLength(4)
  })

  it('marks exactly one tab as selected', () => {
    const { tabs } = renderAt('wt4')
    const selected = tabs.filter(t => t.getAttribute('aria-selected') === 'true')
    expect(selected).toHaveLength(1)
    expect(selected[0]).toHaveAttribute('id', 'tab-wt4')
  })

  /* Roving tabindex: a tablist that leaves every tab tabbable makes the reader
     tab through four tiles to leave the exhibit. */
  it('gives only the selected tab a tabIndex of 0', () => {
    const { tabs } = renderAt('wt2')
    expect(tabs.map(t => t.tabIndex)).toEqual([-1, 0, -1, -1])
  })

  it.each(['{ArrowRight}', '{ArrowDown}'])('%s moves to the next term', async key => {
    const { onSelect, tabs } = renderAt('wt1')
    await pressOn(tabs, 0, key)
    expect(onSelect).toHaveBeenCalledWith('wt2')
  })

  it.each(['{ArrowRight}', '{ArrowDown}'])('%s wraps from the last term to the first', async key => {
    const { onSelect, tabs } = renderAt('wt4')
    await pressOn(tabs, 3, key)
    expect(onSelect).toHaveBeenCalledWith('wt1')
  })

  it.each(['{ArrowLeft}', '{ArrowUp}'])('%s moves to the previous term', async key => {
    const { onSelect, tabs } = renderAt('wt3')
    await pressOn(tabs, 2, key)
    expect(onSelect).toHaveBeenCalledWith('wt2')
  })

  it.each(['{ArrowLeft}', '{ArrowUp}'])('%s wraps from the first term to the last', async key => {
    const { onSelect, tabs } = renderAt('wt1')
    await pressOn(tabs, 0, key)
    expect(onSelect).toHaveBeenCalledWith('wt4')
  })

  it('Home selects the first term', async () => {
    const { onSelect, tabs } = renderAt('wt3')
    await pressOn(tabs, 2, '{Home}')
    expect(onSelect).toHaveBeenCalledWith('wt1')
  })

  it('End selects the last term', async () => {
    const { onSelect, tabs } = renderAt('wt2')
    await pressOn(tabs, 1, '{End}')
    expect(onSelect).toHaveBeenCalledWith('wt4')
  })

  it('moves focus along with the selection', async () => {
    const { tabs } = renderAt('wt1')
    await pressOn(tabs, 0, '{ArrowRight}')
    expect(tabs[1]).toHaveFocus()
  })

  it('selects the term behind a clicked tile', async () => {
    const user = userEvent.setup()
    const { onSelect, tabs } = renderAt('wt4')
    await user.click(tabs[2])
    expect(onSelect).toHaveBeenCalledWith('wt3')
  })
})

/* The four goal marks on a tile are shape and fill alone, aria-hidden, and so silent to
   a screen reader on their own. Each tile's group of marks carries the text alternative
   instead, derived from the same tally the marks are drawn from. */
describe('Chronology goal state summary', () => {
  const tally = (termId: string) => {
    const term = terms.find(t => t.id === termId)
    if (!term) throw new Error(`no term ${termId}`)
    const counts: Partial<Record<(typeof term.goals)[number]['state'], number>> = {}
    for (const goal of term.goals) counts[goal.state] = (counts[goal.state] ?? 0) + 1
    return (['met', 'partial', 'unmet'] as const)
      .filter(state => counts[state])
      .map(state => `${counts[state]} ${stateLabel[state].toLowerCase()}`)
      .join(', ')
  }

  it.each(terms.map(t => t.id))('gives the %s tile an accessible goal tally that matches its goals', termId => {
    const { tabs } = renderAt(termId)
    const tab = tabs.find(t => t.id === `tab-${termId}`)
    if (!tab) throw new Error(`no tab for ${termId}`)

    const group = within(tab).getByRole('group')
    expect(group).toHaveAttribute('aria-label', `Goals: ${tally(termId)}`)
  })

  it('keeps every mark inside the group aria-hidden, so the tally is not read twice', () => {
    const wt4 = terms.find(t => t.id === 'wt4')
    if (!wt4) throw new Error('no wt4 term')
    const { tabs } = renderAt('wt4')
    const group = within(tabs[3]).getByRole('group')

    expect(group.querySelectorAll('[aria-hidden="true"]')).toHaveLength(wt4.goals.length)
    expect(group.textContent).toBe('')
  })
})

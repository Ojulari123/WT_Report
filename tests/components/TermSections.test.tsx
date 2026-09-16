import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TermSections } from '@/components/report/TermSections'
import { interstitials, terms } from '@/content/report'

const termById = (id: string) => {
  const term = terms.find(t => t.id === id)
  if (!term) throw new Error(`no term ${id}`)
  return term
}

describe('TermSections', () => {
  it.each(terms.map(t => [t.id]))('renders sections 2.0 to 4.0 for %s', id => {
    const term = termById(id)
    render(<TermSections term={term} />)

    expect(screen.getByRole('heading', { name: /Employer Information/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Role and Project/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^Goals$/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: term.employer.name })).toBeInTheDocument()
  })

  it('renders every goal of the term it is given', () => {
    const term = termById('wt2')
    render(<TermSections term={term} />)
    for (const goal of term.goals) {
      expect(screen.getByRole('button', { name: new RegExp(goal.title) })).toBeInTheDocument()
    }
  })

  it('renders no carried-in note for the first term', () => {
    render(<TermSections term={termById('wt1')} />)
    expect(screen.queryByText(/Carried in from Work Term/)).toBeNull()
  })

  it.each([
    ['wt2', 'wt1'],
    ['wt3', 'wt2'],
    ['wt4', 'wt3'],
  ])('renders the note carried into %s from %s', (id, previousId) => {
    render(<TermSections term={termById(id)} />)
    const carried = interstitials.find(i => i.after === previousId)
    expect(carried, `no interstitial after ${previousId}`).toBeTruthy()
    expect(screen.getByText(carried!.label)).toBeInTheDocument()
    expect(screen.getByText(carried!.text)).toBeInTheDocument()
  })

  it('renders the ingestion figure for the latest term', () => {
    render(<TermSections term={termById('wt4')} />)
    expect(document.getElementById('figure-3-1')).not.toBeNull()
    expect(screen.getByRole('img', { name: /deduplication layer/ })).toBeInTheDocument()
  })

  it.each(['wt1', 'wt2', 'wt3'])('renders no ingestion figure for %s', id => {
    render(<TermSections term={termById(id)} />)
    expect(document.getElementById('figure-3-1')).toBeNull()
    expect(screen.queryByRole('img', { name: /deduplication layer/ })).toBeNull()
  })
})

'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { stateLabel, type Term } from '@/content/report'
import { StateMark } from './DocPrimitives'
import { plateSrc } from '@/lib/plates'
import { cn } from '@/lib/utils'

/* Derived from stateLabel rather than hardcoded, so the wording tracks the same source
   the disclosures and the state key read from. The marks stay aria-hidden; this is the
   text alternative for the tally they otherwise convey by shape and fill alone. */
function goalSummary(goals: Term['goals']) {
  const tally: Partial<Record<Term['goals'][number]['state'], number>> = {}
  for (const goal of goals) tally[goal.state] = (tally[goal.state] ?? 0) + 1
  const parts = (['met', 'partial', 'unmet'] as const)
    .filter(state => tally[state])
    .map(state => `${tally[state]} ${stateLabel[state].toLowerCase()}`)
  return `Goals: ${parts.join(', ')}`
}

interface ChronologyProps {
  terms: Term[]
  activeId: string
  onSelect: (id: string) => void
}

/*
 * Exhibit A. The chronology is the switcher: selecting a term loads it into sections
 * 2.0 to 4.0. Every term is reported at the same depth, so nothing here is a summary
 * standing in for a chapter that does not exist. Roving tabindex, so the four terms
 * are reachable with the arrow keys.
 */
export function Chronology({ terms, activeId, onSelect }: ChronologyProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const activeIndex = terms.findIndex(t => t.id === activeId)

  const move = (delta: number) => {
    const next = (activeIndex + delta + terms.length) % terms.length
    onSelect(terms[next].id)
    refs.current[next]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      move(1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      move(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      onSelect(terms[0].id)
      refs.current[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      onSelect(terms[terms.length - 1].id)
      refs.current[terms.length - 1]?.focus()
    }
  }

  return (
    <div role="tablist" aria-label="Work terms" onKeyDown={onKeyDown} className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
      {terms.map((term, i) => {
        const on = term.id === activeId
        return (
          <button
            key={term.id}
            ref={el => {
              refs.current[i] = el
            }}
            role="tab"
            id={`tab-${term.id}`}
            aria-selected={on}
            aria-controls="term-sections"
            tabIndex={on ? 0 : -1}
            onClick={() => onSelect(term.id)}
            className={cn('group relative flex flex-col p-4 text-left transition-colors duration-200 sm:p-5', on ? 'bg-plate' : 'bg-paper hover:bg-plate')}
          >
            <span aria-hidden="true" className={cn('absolute inset-x-0 top-0 h-[3px] transition-colors duration-200', on ? 'bg-ink' : 'bg-transparent group-hover:bg-rule')} />

            <span className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-[0.75rem] font-medium tabular-nums text-ink-3">
                {term.ordinal}
              </span>
              {term.isLatest && (
                <span className="border border-ink px-1.5 py-0.5 font-mono text-[0.5625rem] font-medium uppercase tracking-[0.08em] text-ink">
                  Latest
                </span>
              )}
            </span>

            {/* sizes follows the tile grid: four up at lg, two up at sm, one below */}
            <Image
              src={plateSrc[term.plate]}
              alt=""
              aria-hidden="true"
              placeholder="blur"
              loading="lazy"
              sizes="(min-width: 1024px) 250px, (min-width: 640px) calc((100vw - 162px) / 2), calc(100vw - 82px)"
              className={cn('plate-img mt-3 block aspect-[16/10] w-full border border-rule object-cover transition-opacity duration-300', on ? 'opacity-100' : 'opacity-60 group-hover:opacity-85')}
            />

            <span className={cn('mt-4 block text-[1.0625rem] font-semibold leading-snug tracking-[-0.012em] transition-colors', on ? 'text-ink' : 'text-ink-2 group-hover:text-ink')}>
              {term.employer.name}
            </span>
            <span className="mt-1 block font-sans text-[0.8125rem] leading-snug text-ink-2">
              {term.role}
            </span>
            <span className="mt-3 block border-t border-rule-2 pt-3 font-mono text-[0.6875rem] tabular-nums text-ink-3">
              {term.datesShort}
            </span>
            <span className="mt-3 block flex-1 text-[0.9375rem] leading-relaxed text-ink-2">
              {term.beat}
            </span>
            <span className="mt-4 flex items-center gap-1.5 border-t border-rule-2 pt-3">
              <span role="group" aria-label={goalSummary(term.goals)} className="flex items-center gap-1.5">
                {term.goals.map(g => <StateMark key={g.ref} state={g.state} withLabel={false} />)}
              </span>
              <span className={cn('ml-auto font-sans text-[0.75rem] transition-colors', on ? 'text-ink' : 'text-ink-3 group-hover:text-ink')}>
                {on ? 'Showing' : 'Show'}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

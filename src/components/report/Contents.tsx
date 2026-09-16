'use client'

import { contents, figures, terms } from '@/content/report'
import { cn } from '@/lib/utils'

interface ContentsProps {
  activeTermId: string
  onJump: (anchor: string) => void
  onSelectTerm: (id: string) => void
}

/*
 * Table of contents with leader rules. The section list navigates; the work term list
 * beside it swaps which placement sections 2.0 to 4.0 report, so the contents page is
 * also the control for the document.
 */
export function Contents({ activeTermId, onJump, onSelectTerm }: ContentsProps) {
  return (
    <section id="contents" className="scroll-mt-24">
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="border-b border-ink pb-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink">
            Contents
          </h2>
          <ol className="mt-1">
            {contents.map(row => (
              <li key={row.anchor} className="border-b border-rule-2">
                <button type="button" onClick={() => onJump(row.anchor)} className="group flex w-full items-baseline py-2.5 text-left transition-colors duration-200 hover:text-seal">
                  <span className="w-16 shrink-0 font-mono text-[0.75rem] tabular-nums text-ink-3 transition-colors group-hover:text-seal">
                    {row.ref}
                  </span>
                  <span className={cn('text-[1rem] leading-snug', row.front ? 'italic text-ink-2' : 'text-ink')}>
                    {row.title}
                  </span>
                  <span aria-hidden="true" className="leader" />
                  <span className="shrink-0 font-mono text-[0.75rem] text-ink-3 transition-colors group-hover:text-seal">
                    &#8594;
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="border-b border-ink pb-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink">
              Work terms
            </h2>
            <p className="mt-3 font-sans text-[0.75rem] leading-relaxed text-ink-3">
              Sections 2.0 to 4.0 report one placement at a time. Select a term to load it.
            </p>
            <ol className="mt-3">
              {terms.map(t => {
                const on = t.id === activeTermId
                return (
                  <li key={t.id} className="border-b border-rule-2">
                    <button type="button" onClick={() => onSelectTerm(t.id)} aria-current={on ? 'true' : undefined} className="group flex w-full items-baseline gap-3 py-2.5 text-left transition-colors duration-200 hover:text-seal">
                      <span className="w-6 shrink-0 font-mono text-[0.75rem] tabular-nums text-ink-3">
                        {t.ordinal}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cn('block text-[0.9375rem] leading-snug', on ? 'font-semibold text-ink' : 'text-ink-2 group-hover:text-ink')}>
                          {t.employer.name}
                        </span>
                        <span className="mt-0.5 block font-mono text-[0.6875rem] tabular-nums text-ink-3">
                          {t.datesShort}
                        </span>
                      </span>
                      <span className={cn('shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.08em]', on ? 'text-ink' : 'text-ink-3 group-hover:text-seal')}>
                        {on ? 'Showing' : 'Show'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          <div>
            <h2 className="border-b border-ink pb-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink">
              Figures and tables
            </h2>
            <ol className="mt-1">
              {figures.map(f => (
                <li key={f.ref} className="border-b border-rule-2">
                  <button type="button" onClick={() => onJump(f.anchor)} className="group flex w-full flex-col items-start gap-0.5 py-2.5 text-left transition-colors duration-200 hover:text-seal">
                    <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.07em] text-ink-3 transition-colors group-hover:text-seal">
                      {f.ref}
                    </span>
                    <span className="text-[0.9375rem] leading-snug text-ink">{f.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import type { GoalThread } from '@/content/report'
import { terms, threads } from '@/content/report'
import { SectionHead, StateKey, StateMark } from './DocPrimitives'

const termOf = (id: string) => terms.find(t => t.id === id)

/* A thread is judged on its last actual assessment. A term where the goal was not set
   carries no verdict, so those cells are skipped instead of being read as a failure to
   meet it. A thread that was never assessed at all is not marked open. */
const isOpen = (thread: GoalThread) => {
  const assessed = thread.cells.filter(cell => cell.state !== 'na')
  return assessed.length > 0 && assessed[assessed.length - 1].state !== 'met'
}

interface ProgressionTableProps {
  onSelectTerm: (id: string) => void
}

/*
 * Section 6.0 and Table 5.1. The one place in the portfolio where the reader compares
 * across terms instead of reading down a column. Commentary sits underneath as numbered
 * notes, the way a report annotates a table, rather than being crammed into the cells.
 */
export function ProgressionTable({ onSelectTerm }: ProgressionTableProps) {
  return (
    <section>
      <SectionHead id="sec-5" num="5.0" title="Goal Progression Across Four Terms" sub="Each recurring goal tracked across all four placements rather than reported once per term." />

      <p className="measure-wide mt-7 text-[1.0625rem] leading-[1.72] text-ink">
        Four goals recur across the four terms, and no single goal was set in all four. Two of them
        run through three terms each and were met every time they were set, with the wording asking
        for more each time. One was met in the first term, recorded as partially met in the second,
        and then not set again. One appears only in the last two terms, met in the third and
        partially met in the fourth, which is where it still sits. Reading the rows across is the
        point of the table.
      </p>

      <div className="mt-7 border-y border-rule py-4">
        <StateKey />
      </div>

      {/* ── Table 5.1, wide viewports ────────────────────────────────────── */}
      <figure id="table-5-1" className="mt-8 scroll-mt-24">
        <div className="hidden border border-rule bg-plate lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Goal state by work term. Rows are recurring goals, columns are the four work terms.
            </caption>
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className="w-[24%] px-4 py-3 align-bottom">
                  <span className="field-label">Recurring goal</span>
                </th>
                {terms.map(t => (
                  <th key={t.id} scope="col" className="px-4 py-3 align-bottom">
                    <button type="button" onClick={() => onSelectTerm(t.id)} className="group text-left transition-colors duration-200 hover:text-seal">
                      <span className="block font-mono text-[0.6875rem] tabular-nums text-ink-3 transition-colors group-hover:text-seal">
                        {t.ordinal}
                      </span>
                      <span className="mt-0.5 block font-sans text-[0.8125rem] font-semibold text-ink transition-colors group-hover:text-seal">
                        {t.label}
                      </span>
                      <span className="mt-0.5 block font-sans text-[0.75rem] font-normal text-ink-3">
                        {t.employer.name}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {threads.map(thread => {
                const open = isOpen(thread)
                return (
                  <tr key={thread.ref} className="border-b border-rule-2 align-top last:border-b-0">
                    <th scope="row" className="px-4 py-5 font-normal">
                      <span className="flex items-baseline gap-2.5">
                        <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">
                          {thread.ref}
                        </span>
                        <span className="text-[0.9375rem] font-semibold leading-snug text-ink">
                          {thread.title}
                        </span>
                      </span>
                      {open && (
                        <span className="mt-2 inline-block border border-seal px-1.5 py-0.5 font-mono text-[0.5625rem] font-medium uppercase tracking-[0.08em] text-seal">
                          Still open
                        </span>
                      )}
                    </th>
                    {thread.cells.map(cell => (
                      <td key={cell.termId} className="px-4 py-5">
                        <StateMark state={cell.state} />
                        <p className="mt-2 font-sans text-[0.8125rem] leading-relaxed text-ink-2">
                          {cell.note}
                        </p>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Same data, stacked, below the table breakpoint ─────────────── */}
        <div className="space-y-px bg-rule lg:hidden">
          {threads.map(thread => {
            const open = isOpen(thread)
            return (
              <div key={thread.ref} className="bg-plate p-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[0.6875rem] tabular-nums text-ink-3">
                    {thread.ref}
                  </span>
                  <h3 className="text-[0.9375rem] font-semibold leading-snug text-ink">
                    {thread.title}
                  </h3>
                </div>
                {open && (
                  <span className="mt-2 inline-block border border-seal px-1.5 py-0.5 font-mono text-[0.5625rem] font-medium uppercase tracking-[0.08em] text-seal">
                    Still open
                  </span>
                )}
                <dl className="mt-3 divide-y divide-rule-2 border-t border-rule-2">
                  {thread.cells.map(cell => {
                    const t = termOf(cell.termId)
                    return (
                      <div key={cell.termId} className="py-3">
                        <dt className="flex items-center justify-between gap-3">
                          {/* The padding and the equal negative margin give the term link a
                              44px tap box that reaches into the row's own padding, so the
                              stacked table gains a thumb target and not a pixel of height. */}
                          <button type="button" onClick={() => t && onSelectTerm(t.id)} className="-my-3 py-3 font-sans text-[0.8125rem] font-medium text-ink underline decoration-rule underline-offset-2 transition-colors hover:text-seal">
                            {t?.label}
                          </button>
                          <StateMark state={cell.state} />
                        </dt>
                        <dd className="mt-1.5 font-sans text-[0.8125rem] leading-relaxed text-ink-2">
                          {cell.note}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            )
          })}
        </div>

        <figcaption className="mt-2.5 flex gap-2.5 font-sans text-[0.75rem] leading-relaxed text-ink-3">
          <span className="shrink-0 font-mono font-medium text-ink-2">Table 5.1</span>
          <span>
            Goal state by work term. Select a column heading to load that term into sections 2.0 to 4.0.
          </span>
        </figcaption>
      </figure>

      <div className="mt-12 border-t border-rule pt-7">
        <p className="field-label">Notes to Table 5.1</p>
        <dl className="mt-5 space-y-6">
          {threads.map(thread => (
            <div key={thread.ref} className="flex gap-5 sm:gap-7">
              <dt className="shrink-0 font-mono text-[0.75rem] tabular-nums text-ink-3">
                {thread.ref}
              </dt>
              <dd className="measure-wide text-[1.0625rem] leading-[1.7] text-ink-2">{thread.arc}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

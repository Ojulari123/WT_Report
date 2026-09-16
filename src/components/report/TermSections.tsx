import { interstitials, terms, type Term } from '@/content/report'
import { Disclosure, Field, Figure, Plate, SectionHead, StateKey, StateMark, TechMark } from './DocPrimitives'
import { IngestionFigure } from './IngestionFigure'
import { plateSrc } from '@/lib/plates'

interface TermSectionsProps {
  term: Term
}

/*
 * Sections 2.0 to 4.0 for whichever term is selected in Exhibit A. The section
 * numbers are fixed because only one term is on screen at a time; each head carries
 * a sub-line naming the term it is currently reporting.
 */
export function TermSections({ term }: TermSectionsProps) {
  const index = terms.findIndex(t => t.id === term.id)
  const previous = index > 0 ? terms[index - 1] : undefined
  const carriedIn = previous ? interstitials.find(x => x.after === previous.id) : undefined
  const tally = term.goals.reduce<Record<string, number>>((acc, g) => {
    acc[g.state] = (acc[g.state] ?? 0) + 1
    return acc
  }, {})
  const tallyLine = (['met', 'partial', 'unmet'] as const).filter(s => tally[s]).map(s => `${tally[s]} ${s === 'partial' ? 'partially met' : s}`).join(', ')

  return (
    <div id="term-sections" role="tabpanel" aria-labelledby={`tab-${term.id}`} className="space-y-16 sm:space-y-20">
      {/* ── Carried in from the previous term ─────────────────────────────
          The narrative thread. One term is on screen at a time, so what would
          otherwise sit between two chapters attaches to the top of this one. */}
      {carriedIn && (
        <aside className="border-y border-rule bg-plate px-6 py-7 sm:px-10 sm:py-8">
          <div className="max-w-[38rem]">
            <p className="field-label">{carriedIn.label}</p>
            <p className="mt-2.5 text-[1.0625rem] leading-[1.7] text-ink sm:text-[1.125rem]">
              {carriedIn.text}
            </p>
          </div>
        </aside>
      )}

      {/* ── 2.0 Employer Information ─────────────────────────────────── */}
      <section>
        <SectionHead id="sec-2" num="2.0" title="Employer Information" sub={`${term.label}, ${term.season}, ${term.location}`} />

        <div className="mt-7 grid gap-x-12 gap-y-9 lg:grid-cols-[1fr_19rem]">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="text-[1.375rem] font-semibold tracking-[-0.015em] text-ink sm:text-[1.5rem]">
                {term.employer.name}
              </h3>
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.07em] text-ink-3">
                {term.employer.sector}
              </span>
            </div>

            <p className="measure-wide mt-4 text-[1.0625rem] leading-[1.72] text-ink">
              {term.employer.description}
            </p>

            <div className="mt-7 border-l-2 border-ink pl-5">
              <p className="field-label">Relevance to computing</p>
              <p className="measure-wide mt-2 text-[1.0625rem] leading-[1.72] text-ink-2">
                {term.employer.computingRelevance}
              </p>
            </div>

            <div className="mt-7 border-t border-rule pt-5">
              <p className="field-label">The term in one line</p>
              <p className="measure-wide mt-2 text-[1.0625rem] leading-[1.72] text-ink">
                {term.beat}
              </p>
            </div>
          </div>

          <div className="space-y-7">
            {/* Full width on a phone, capped between sm and lg: the plate carries a brand
                mark, and a 4:3 frame across 688px of a tablet is 516px of paper around a
                wordmark. At lg it sits in the sidebar and needs no cap. */}
            <Plate src={plateSrc[term.plate]} alt={term.plateAlt} caption={term.plateCaption} ref_={`Plate ${index + 1}`} className="sm:max-w-sm lg:max-w-none" />
            <dl className="divide-y divide-rule-2 border-y border-rule-2">
              {term.employer.facts.map(f => (
                <Field key={f.label} label={f.label} className="py-3">
                  {f.value}
                </Field>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── 3.0 Role and Project ─────────────────────────────────────── */}
      <section>
        <SectionHead id="sec-3" num="3.0" title="Role and Project" sub={`${term.role}. ${term.project}`} />

        <div className="mt-7">
          <p className="measure-wide text-[1.125rem] leading-[1.7] text-ink">{term.job.overview}</p>
          <div className="mt-7 border-l-2 border-seal pl-5">
            <p className="field-label">What made it unusual</p>
            <p className="measure-wide mt-2 text-[1.0625rem] leading-[1.72] text-ink-2">
              {term.job.unique}
            </p>
          </div>
        </div>

        {term.isLatest && (
          <div className="mt-10">
            <Figure id="figure-3-1" ref_="Figure 3.1" caption="The agent platform built during this term. Four inbound channels reach one router, which keeps a sticky session in Postgres and dispatches to three agents. The scheduler agent, marked in accent, is seven of the ten workflows.">
              <IngestionFigure />
            </Figure>
          </div>
        )}

        <div className="mt-10 grid gap-x-12 gap-y-9 border-t border-rule pt-7 lg:grid-cols-2">
          <div>
            <p className="field-label">Skills the role required</p>
            <ul className="mt-3 space-y-2">
              {term.job.skills.map(s => (
                <li key={s} className="flex gap-3 font-sans text-[0.9375rem] leading-relaxed text-ink-2">
                  <span aria-hidden="true" className="mt-[0.5rem] h-px w-3 shrink-0 bg-rule" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="field-label">Technologies used</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {term.job.stack.map(t => <TechMark key={t.name} name={t.name} slug={t.slug} />)}
            </div>
          </div>
        </div>

        <div className="mt-9 border-t border-rule pt-7">
          <p className="field-label">Related coursework</p>
          <dl className="mt-4 divide-y divide-rule-2 border-y border-rule-2">
            {term.job.coursework.map(c => (
              <div key={c.code} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[7rem_1fr] lg:grid-cols-[7rem_15rem_1fr]">
                <dt className="font-mono text-[0.8125rem] font-medium text-ink">{c.code}</dt>
                <dd className="font-sans text-[0.875rem] text-ink-2">{c.title}</dd>
                <dd className="text-[0.9375rem] leading-relaxed text-ink-2 sm:col-span-2 lg:col-span-1">
                  {c.relation}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 4.0 Goals ────────────────────────────────────────────────── */}
      <section>
        <SectionHead id="sec-4" num="4.0" title="Goals" sub={`${term.label}. ${term.goals.length} goals set at the start of the term: ${tallyLine}.`} />
        <div className="mt-5 border-b border-rule pb-4">
          <StateKey />
        </div>
        <div className="mt-2">
          {term.goals.map((goal, i) => (
            <Disclosure
              key={goal.ref}
              id={`goal-${term.id}-${goal.ref.replace('.', '-')}`}
              defaultOpen={i === 0}
              summary={
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[0.75rem] font-medium tabular-nums text-ink-3">
                    {goal.ref}
                  </span>
                  <span className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {goal.title}
                  </span>
                </span>
              }
              meta={<StateMark state={goal.state} />}
            >
              <dl className="measure-wide space-y-5">
                <div>
                  <dt className="field-label">What I set out to do</dt>
                  <dd className="mt-1.5 text-[1.0625rem] leading-[1.7] text-ink-2">{goal.target}</dd>
                </div>
                <div>
                  <dt className="field-label">What happened</dt>
                  <dd className="mt-1.5 text-[1.0625rem] leading-[1.7] text-ink">{goal.outcome}</dd>
                </div>
                {goal.evidence && (
                  <div>
                    <dt className="field-label">Evidence</dt>
                    <dd className="mt-1.5 font-sans text-[0.875rem] leading-relaxed text-ink-2">
                      {goal.evidence}
                    </dd>
                  </div>
                )}
              </dl>
            </Disclosure>
          ))}
        </div>
      </section>
    </div>
  )
}

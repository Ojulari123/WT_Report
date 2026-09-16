'use client'

import { report, student, terms } from '@/content/report'

interface CoverPlateProps {
  onBegin: () => void
}

/*
 * Title page, set entirely in type on paper. No photograph and no type over an image:
 * the imagery in this document lives in the plates inside each term and in Figure 3.1,
 * and a cover carrying one placement's photograph misrepresents a portfolio of four.
 * The four placements are listed here as a ruled table so the whole span is visible
 * before the reader scrolls.
 */
export function CoverPlate({ onBegin }: CoverPlateProps) {
  return (
    <section aria-label="Title page" className="flex min-h-[100dvh] flex-col bg-paper">
      <div className="mx-auto w-full max-w-6xl pt-8 pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pt-10 sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-ink pb-3">
          <p className="font-sans text-[0.8125rem] font-medium text-ink">
            {report.institution}
            <span className="mx-2 text-ink-3">/</span>
            <span className="text-ink-2">{report.school}</span>
          </p>
          <p className="font-mono text-[0.75rem] tracking-[0.06em] text-ink-2">{report.course}</p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center py-14 pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]">
        <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-ink-3">
          {report.kind}
        </p>
        <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,6.2vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
          {report.title}
        </h1>

        {/* The four placements, as a ruled table rather than a sentence. */}
        <ol className="mt-12 max-w-4xl border-t border-ink">
          {terms.map(t => (
            <li key={t.id} className="grid grid-cols-[2rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-rule-2 py-3.5 sm:grid-cols-[2.5rem_1fr_1fr_8.5rem] sm:gap-x-6">
              <span className="font-mono text-[0.75rem] tabular-nums text-ink-3">{t.ordinal}</span>
              <span className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                {t.employer.name}
              </span>
              <span className="col-start-2 font-sans text-[0.875rem] text-ink-2 sm:col-start-3">
                {t.role}
              </span>
              <span className="col-start-2 font-mono text-[0.75rem] tabular-nums text-ink-3 sm:col-start-4 sm:text-right">
                {t.datesShort}
              </span>
            </li>
          ))}
        </ol>

        <button type="button" onClick={onBegin} className="mt-10 inline-flex w-fit items-center gap-2.5 border border-ink bg-ink px-5 py-2.5 font-sans text-[0.875rem] font-medium text-paper transition-colors duration-200 hover:bg-ink-2">
          Read the report
          <span aria-hidden="true" className="text-[1rem] leading-none">
            &#8594;
          </span>
        </button>
      </div>

      <div className="mx-auto w-full max-w-6xl pb-10 pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pb-12 sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink pt-6 sm:grid-cols-4">
          {[
            { k: 'Submitted by', v: [student.name, `Student ID ${student.studentId}`] },
            { k: 'Programme', v: [student.program] },
            { k: 'Submitted to', v: [report.submittedTo] },
            { k: 'Date of submission', v: [report.submissionDate] },
          ].map(row => (
            <div key={row.k}>
              <dt className="field-label">{row.k}</dt>
              {row.v.map(line => (
                <dd key={line} className="mt-1 font-sans text-[0.8125rem] leading-snug text-ink">
                  {line}
                </dd>
              ))}
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-2xl font-sans text-[0.75rem] leading-relaxed text-ink-3">
          {report.confidentiality}
        </p>
      </div>
    </section>
  )
}

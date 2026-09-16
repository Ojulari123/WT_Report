'use client'

import { report, student, terms } from '@/content/report'

interface CoverPlateProps {
  onBegin: () => void
}

const gutter =
  'pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]'

/*
 * Title page, set entirely in type on paper. No photograph and no type over an image:
 * the imagery in this document lives in the plates inside each term and in Figure 3.1,
 * and a cover carrying one placement's photograph misrepresents a portfolio of four.
 *
 * The page is two stacked plates. The head is a full-bleed ink rectangle with the
 * institution line and the kicker reversed out of it, and one seal hairline sits exactly
 * on the seam where the ink stops. Below it the title runs flush left at close to
 * viewport-filling size and the placements table is pushed into the right two thirds and
 * down to the foot, which leaves a tall empty column under the title. That column is the
 * point: the band carries the top of the page, so the white below the title reads as
 * held space rather than as a gap.
 */
export function CoverPlate({ onBegin }: CoverPlateProps) {
  return (
    <section aria-label="Title page" className="flex min-h-[100dvh] flex-col bg-paper">
      <div className="cover-band-in w-full">
        <div className={`w-full bg-ink pb-8 pt-8 sm:pt-10 ${gutter}`}>
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-paper/25 pb-3">
              <p className="font-sans text-[0.8125rem] font-medium text-paper">
                {report.institution}
                <span className="mx-2 text-paper/45">/</span>
                <span className="text-paper/75">{report.school}</span>
              </p>
              <p className="font-mono text-[0.75rem] tracking-[0.06em] text-paper/75">
                {report.course}
              </p>
            </div>
            <p className="mt-8 font-mono text-[0.8125rem] uppercase tracking-[0.2em] text-paper sm:text-[0.875rem]">
              {report.kind}
            </p>
          </div>
        </div>

        {/* The seam. One hairline of the single accent, exactly where the ink stops. */}
        <div aria-hidden="true" className="h-px w-full bg-seal" />
      </div>

      <div className={`mx-auto flex w-full max-w-6xl flex-1 flex-col pt-7 sm:pt-8 ${gutter}`}>
        <h1 className="cover-title-in text-[clamp(2.75rem,10.2vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-ink">
          {report.title}
        </h1>

        {/* The four placements, as a ruled table rather than a sentence. The 3px top rule
            gives it enough weight to answer the band. */}
        <div className="mt-auto w-full pt-8 sm:w-2/3 sm:self-end">
          <ol className="border-t-[3px] border-ink">
            {terms.map(t => (
              <li
                key={t.id}
                className="grid grid-cols-[2rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-rule-2 py-3 sm:grid-cols-[2.5rem_1fr_1fr_8.5rem] sm:gap-x-5"
              >
                <span className="font-mono text-[0.75rem] tabular-nums text-ink-3">
                  {t.ordinal}
                </span>
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

          <button
            type="button"
            onClick={onBegin}
            className="mt-7 inline-flex w-fit items-center gap-2.5 border border-ink bg-ink px-5 py-2.5 font-sans text-[0.875rem] font-medium text-paper transition-colors duration-200 hover:bg-ink-2"
          >
            Read the report
            <span aria-hidden="true" className="text-[1rem] leading-none">
              &#8594;
            </span>
          </button>
        </div>
      </div>

      <div className={`mx-auto w-full max-w-6xl pb-10 pt-6 ${gutter}`}>
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

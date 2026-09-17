'use client'

import { report, student, terms } from '@/content/report'

interface CoverPlateProps {
  onBegin: () => void
}

const gutter =
  'pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]'

/* The ghost numeral hangs off the left edge of the page, but it is anchored inside the
   gutter-padded column so its foot can sit on the button. The gutter is cancelled back
   out here, from the same two tokens, so the bleed is measured from the page edge rather
   than from the text column. */
const numeralBleed =
  'left-[calc((env(safe-area-inset-left,0px)+1.5rem+0.2em)*-1)] sm:left-[calc((env(safe-area-inset-left,0px)+2.5rem+0.2em)*-1)]'

/*
 * Title page, set entirely in type on paper. No photograph and no type over an image:
 * the imagery in this document lives in the plates inside each term and in Figure 3.1,
 * and a cover carrying one placement's photograph misrepresents a portfolio of four.
 *
 * The page is a broken grid rather than a stack of centred blocks. Everything is paper.
 * The head is ink type on paper with one hairline under it, the title runs flush left at
 * close to viewport-filling size, and the placements table is pushed into the right two
 * thirds and down to the foot. From sm the mono kicker is set vertically up the left
 * margin. The tall empty column under the title is the composition, not a gap: the kicker
 * holds its left edge and the table anchors its foot.
 *
 * Below lg the left margin is held instead by a ghost numeral of the placement count,
 * and the kicker sets horizontally under the head rule, because at 390px there is no
 * margin for a vertical line to stand in.
 */
export function CoverPlate({ onBegin }: CoverPlateProps) {
  return (
    <section aria-label="Title page" className="relative flex min-h-[100dvh] flex-col bg-paper pt-8 sm:pt-10">
      <div className={`mx-auto w-full max-w-6xl ${gutter}`}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-ink pb-3">
          <p className="font-sans text-[0.8125rem] font-medium text-ink">
            {report.institution}
            <span className="mx-2 text-ink-3">/</span>
            <span className="text-ink-2">{report.school}</span>
          </p>
          <p className="font-mono text-[0.75rem] tracking-[0.06em] text-ink-2">{report.course}</p>
        </div>

        <div className="relative">
          {/* At small sizes the kicker sets horizontally here, under the rule. The vertical
              setting up the left margin needs a margin to stand in, and at 390px there is
              none once the numeral holds that edge. */}
          <p className="relative z-10 mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3 sm:hidden">
            {report.kind}
          </p>

          <h1 className="cover-title-in relative z-10 mt-4 text-[clamp(2.5rem,10.2vw,8rem)] font-semibold leading-[0.99] tracking-[-0.045em] text-ink sm:mt-9 sm:leading-[0.92]">
            {report.title}
          </h1>
        </div>
      </div>

      <div className={`relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col ${gutter}`}>
        {/* Reads bottom to top up the left margin. Anchored at 40% of this block rather
            than to its foot, because a bottom anchor clipped the head of the line once the
            block grew. z-10 because the ghost numeral is now a positioned element in this
            same block and crosses this line's column at sm. */}
        <p className="absolute left-[calc(env(safe-area-inset-left,0px)+0.25rem)] top-[40%] z-10 hidden rotate-180 whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-3 [writing-mode:vertical-rl] sm:block sm:text-[0.75rem] sm:tracking-[0.2em]">
          {report.kind}
        </p>

        {/* The placements and the button, plus the ghost numeral behind them, as one block
            pushed to the foot of this column. The wrapper exists so the numeral has
            something to hang from: bottom-0 here is the bottom of the button at every
            viewport height, where an offset from the foot of the section would only land
            at one. w-full rather than the inner block's width, so the numeral still
            measures its bleed from the page edge and not from the two-thirds column. */}
        <div className="relative mt-auto w-full">
          {/* Four placements, set once at the scale of the page, bleeding off the left edge
              so the reader gets a fragment rather than a graphic, at 4 percent ink so it
              cannot compete with the type in front of it. It sits behind the last placement
              rows and the button and stops at the button's foot, clear of the submission
              details below. Off at lg, where the wide composition is already settled. */}
          <span aria-hidden="true" className={`pointer-events-none absolute bottom-0 z-0 select-none font-serif text-[42vh] font-semibold leading-[0.74] tracking-[-0.06em] text-ink/[0.04] lg:hidden ${numeralBleed}`}>
            {terms.length}
          </span>

          {/* The four placements, as a ruled table rather than a sentence. The 3px top rule
              gives it enough weight to anchor the foot of the page against the title. The
              z-10 keeps the rows and the button painting over the numeral: the numeral is a
              positioned child of the same wrapper, so in-flow siblings would otherwise sit
              under it. ml-auto rather than self-end, now that the flex item is the wrapper. */}
          <div className="relative z-10 w-full pt-8 sm:ml-auto sm:w-2/3">
            <ol className="border-t-[3px] border-ink">
              {terms.map(t => (
                <li
                  key={t.id}
                  className="grid grid-cols-[2rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-rule-2 py-3 lg:grid-cols-[2.5rem_1fr_1fr_8.5rem] lg:gap-x-5"
                >
                  <span className="font-mono text-[0.75rem] tabular-nums text-ink-3">
                    {t.ordinal}
                  </span>
                  <span className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {t.employer.name}
                  </span>
                  <span className="col-start-2 font-sans text-[0.875rem] text-ink-2 lg:col-start-3">
                    {t.role}
                  </span>
                  <span className="col-start-2 font-mono text-[0.75rem] tabular-nums text-ink-3 lg:col-start-4 lg:text-right">
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
      </div>

      {/* No relative z-10 here. It existed to paint the submission details over the ghost
          numeral when the numeral was anchored to the foot of the section; the numeral now
          stops at the button above, so there is nothing to sit in front of. */}
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

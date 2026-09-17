'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { appendix, conclusions, introduction, report, student, terms } from '@/content/report'
import { MarginNote, SectionHead } from './DocPrimitives'
import { CoverPlate } from './CoverPlate'
import { LetterOfSubmittal } from './LetterOfSubmittal'
import { Contents } from './Contents'
import { Chronology } from './Chronology'
import { TermSections } from './TermSections'
import { ProgressionTable } from './ProgressionTable'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'sec-1', label: 'Introduction', ref: '1.0' },
  { id: 'exhibit-a', label: 'Chronology', ref: 'A' },
  { id: 'sec-5', label: 'Progression', ref: '5.0' },
  { id: 'sec-6', label: 'Conclusions', ref: '6.0' },
]

const HEAD_LABELS: Record<string, string> = {
  letter: 'Letter of Submittal',
  contents: 'Contents',
  'sec-1': '1.0  Introduction',
  'exhibit-a': 'Exhibit A  Chronology',
  'sec-2': '2.0  Employer Information',
  'sec-3': '3.0  Role and Project',
  'sec-4': '4.0  Goals',
  'sec-5': '5.0  Goal Progression',
  'sec-6': '6.0  Conclusions',
  'sec-7': '7.0  Acknowledgments',
  'appendix-a': 'Appendix A  Professional Log',
}

const OBSERVED = Object.keys(HEAD_LABELS)

/* The latest placement is what a reader wants first, so it is loaded by default. */
const latest = terms.find(t => t.isLatest) ?? terms[terms.length - 1]

export function WorkTermReportSite() {
  const [activeTermId, setActiveTermId] = useState(latest.id)
  const [activeId, setActiveId] = useState('letter')
  const [pastCover, setPastCover] = useState(false)
  const coverRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)
  const activeTerm = terms.find(t => t.id === activeTermId) ?? latest

  useEffect(() => {
    /* A reload part way down should open the document rather than resume it, so the
       browser's own scroll restoration is handed back and this load is pinned to the top.
       Instantly: on a reload the reader asked to travel nowhere, so a scroll animation
       would read as the page overriding them, and on a phone it would fight momentum.
       A hash is an explicit request for somewhere else and is honoured instead. The
       anchors carry scroll-mt-24, so a hash target settles under the fixed header at the
       same offset a nav jump uses. Mount only, so neither the nav jumps nor the
       term-swap scroll are touched afterwards. */
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

    const fragment = window.location.hash.slice(1)
    const target = fragment ? document.getElementById(decodeURIComponent(fragment)) : null
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' })
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    /* Recompute from element rects on each crossing rather than trusting whichever
       target happens to be intersecting: the ids sit on short section heads, so an
       intersection-only test yields an empty set and freezes on a stale value. The
       same recompute also derives the header reveal from the cover's own rect: an
       instant scroll can jump clean over a 1px target without an intersection
       callback firing, but it cannot skip past a viewport-tall element without
       crossing its boundary, so the cover section itself is the observed target. */
    const recompute = () => {
      let current = OBSERVED[0]
      for (const id of OBSERVED) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      setActiveId(current)

      const coverEl = coverRef.current
      if (coverEl) setPastCover(coverEl.getBoundingClientRect().bottom <= 0)
    }
    const io = new IntersectionObserver(recompute, {
      rootMargin: '0px',
      threshold: [0, 1],
    })
    OBSERVED.forEach(id => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    if (coverRef.current) io.observe(coverRef.current)
    recompute()
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    /* The reading-progress bar is driven by CSS scroll(root) wherever that exists, which
       costs this component nothing. Firefox has no scroll-driven animations, so there the
       bar would sit at scaleX(0) forever, and the user asked for it to work rather than
       disappear. The standing rule against scroll listeners was about per-frame React
       re-renders; this one is registered only in engines that cannot do the job in CSS, is
       passive, coalesces every burst into one requestAnimationFrame, and writes a single
       style property on a single element without touching state. Do not "fix" it away. */
    const cssDrivesIt =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline', 'scroll()')
    if (cssDrivesIt) return

    /* The reduced-motion block in globals.css neutralises this animation, so the fallback
       has to stay inert there too or the two paths would disagree. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = progressRef.current
    if (!el) return

    let frame = 0
    const paint = () => {
      frame = 0
      const doc = document.documentElement
      /* A document shorter than the viewport has a zero span and no progress to show. */
      const span = doc.scrollHeight - doc.clientHeight
      const progress = span > 0 ? Math.min(Math.max(doc.scrollTop / span, 0), 1) : 0
      el.style.transform = `scaleX(${progress})`
    }
    /* A frame already pending is the same frame this event wants, so the event is dropped
       rather than stacking another callback on top of it. */
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(paint)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    paint()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = Math.max(el.getBoundingClientRect().top + window.scrollY - 96, 0)
    const far = Math.abs(top - window.scrollY) > 2400
    window.scrollTo({
      top,
      behavior: far ? 'instant' : 'smooth',
    })
  }, [])

  /* Selecting a term swaps sections 2.0 to 4.0 and brings the reader to them. */
  const selectTerm = useCallback((id: string) => {
    setActiveTermId(id)
    requestAnimationFrame(() => scrollTo('sec-2'))
  }, [scrollTo])

  return (
    <div className="min-h-[100dvh] w-full bg-paper text-ink">
      <header className={cn('no-print fixed inset-x-0 top-0 z-40 border-b border-rule bg-paper/92 backdrop-blur-sm transition-all duration-300', pastCover ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0')}>
        {/* Horizontal insets are env()-aware so the bar clears the notch in landscape on iOS.
            They resolve to 0 wherever there is no inset, which is every desktop browser. */}
        <div className="mx-auto flex max-w-6xl items-center gap-6 py-3 pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })} className="hidden min-w-0 shrink text-left font-sans text-[0.75rem] leading-tight lg:block">
            <span className="block font-medium text-ink">{student.name}</span>
            <span className="block truncate font-mono text-[0.6875rem] text-ink-3">
              {HEAD_LABELS[activeId] ?? report.kind}
            </span>
          </button>

          {/* which placement is loaded, since sections 2.0 to 4.0 depend on it */}
          <p className="hidden min-w-0 shrink border-l border-rule pl-6 font-sans text-[0.75rem] leading-tight xl:block">
            <span className="block field-label">Showing</span>
            <span className="mt-0.5 block truncate text-ink">{activeTerm.employer.name}</span>
          </p>

          <nav aria-label="Report sections" className="ml-auto flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {NAV.map(item => {
              const on = activeId === item.id
              /* py-2.5 below lg carries the nav item to a 45px tap target on a phone. At lg a
                 pointer is doing the work and the bar keeps the height it had. */
              return (
                <button key={item.id} type="button" onClick={() => scrollTo(item.id)} aria-current={on ? 'true' : undefined} className={cn('group shrink-0 px-2.5 py-2.5 font-sans text-[0.8125rem] transition-colors duration-200 lg:py-1.5', on ? 'text-ink' : 'text-ink-3 hover:text-ink')}>
                  <span className="mr-1.5 font-mono text-[0.6875rem] tabular-nums text-ink-3">
                    {item.ref}
                  </span>
                  {item.label}
                  <span aria-hidden="true" className={cn('mt-1 block h-px transition-colors duration-200', on ? 'bg-seal' : 'bg-transparent group-hover:bg-rule')} />
                </button>
              )
            })}
          </nav>
        </div>
        <div ref={progressRef} aria-hidden="true" className="reading-progress h-[2px] w-full bg-seal" />
      </header>

      <div ref={coverRef}>
        <CoverPlate onBegin={() => scrollTo('letter')} />
      </div>

      <main className="mx-auto max-w-6xl pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]">
        <div className="space-y-20 py-16 sm:space-y-24 sm:py-20">
          <LetterOfSubmittal />

          <Contents activeTermId={activeTermId} onJump={scrollTo} onSelectTerm={selectTerm} />

          {/* ── 1.0 Introduction ──────────────────────────────────────── */}
          <section>
            <SectionHead id="sec-1" num="1.0" title="Introduction" />
            <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-[1fr_15rem]">
              <div>
                <p className="measure-wide text-[1.375rem] font-semibold leading-[1.34] tracking-[-0.015em] text-ink sm:text-[1.625rem]">
                  {introduction.lead}
                </p>
                <div className="measure-wide mt-6 space-y-5">
                  {introduction.body.map((para, i) => (
                    <p key={i} className="text-[1.0625rem] leading-[1.75] text-ink-2">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-6 lg:pt-2">
                {introduction.marginNotes.map(n => (
                  <MarginNote key={n.anchor} anchor={n.anchor}>
                    {n.text}
                  </MarginNote>
                ))}
              </div>
            </div>
          </section>

          {/* ── Exhibit A, the switcher ───────────────────────────────── */}
          <section id="exhibit-a" className="scroll-mt-24">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink pb-3">
              <div className="flex items-baseline gap-4 sm:gap-6">
                <span className="font-mono text-[0.8125rem] font-medium text-ink-3">A</span>
                <h2 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[1.875rem]">
                  Work Term Chronology
                </h2>
              </div>
              <p className="font-sans text-[0.75rem] text-ink-3">
                Arrow keys to move between terms
              </p>
            </div>

            <div className="mt-8 border border-rule">
              <Chronology terms={terms} activeId={activeTermId} onSelect={selectTerm} />
            </div>
            <p className="mt-2.5 flex gap-2.5 font-sans text-[0.75rem] leading-relaxed text-ink-3">
              <span className="shrink-0 font-mono font-medium text-ink-2">Exhibit A</span>
              <span>
                The four placements in order, with the goal states recorded in each. Selecting one
                loads it into sections 2.0 to 4.0, which report every term at the same depth.
              </span>
            </p>
          </section>

          {/* ── 2.0 to 4.0, the selected placement ────────────────────── */}
          <div key={activeTerm.id} className="term-swap">
            <TermSections term={activeTerm} />
          </div>

          <ProgressionTable onSelectTerm={selectTerm} />

          {/* ── 6.0 Conclusions ───────────────────────────────────────── */}
          <section>
            <SectionHead id="sec-6" num="6.0" title="Conclusions" />
            <p className="measure-wide mt-8 text-[1.375rem] font-semibold leading-[1.34] tracking-[-0.015em] text-ink sm:text-[1.5rem]">
              {conclusions.lead}
            </p>
            <ol className="mt-10 space-y-9">
              {conclusions.points.map((p, i) => (
                <li key={p.heading} className="flex gap-5 sm:gap-7">
                  <span className="mt-1.5 shrink-0 font-mono text-[0.75rem] tabular-nums text-ink-3">
                    6.{i + 1}
                  </span>
                  <div className="measure-wide">
                    <h3 className="text-[1.125rem] font-semibold tracking-[-0.012em] text-ink sm:text-[1.1875rem]">
                      {p.heading}
                    </h3>
                    <p className="mt-2.5 text-[1.0625rem] leading-[1.75] text-ink-2">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ── 7.0 Acknowledgments, for the selected placement ───────── */}
          <section>
            <SectionHead id="sec-7" num="7.0" title="Acknowledgments" sub={`${activeTerm.label}, ${activeTerm.employer.name}`} />
            <dl className="mt-8 divide-y divide-rule-2 border-y border-rule-2">
              {activeTerm.acknowledgments.map(a => (
                <div key={a.name} className="grid gap-x-8 gap-y-1.5 py-5 sm:grid-cols-[16rem_1fr]">
                  <dt>
                    <span className="block font-sans text-[0.9375rem] font-semibold text-ink">
                      {a.name}
                    </span>
                    <span className="block font-sans text-[0.75rem] uppercase tracking-[0.07em] text-ink-3">
                      {a.role}
                    </span>
                  </dt>
                  <dd className="measure-wide text-[1.0625rem] leading-[1.7] text-ink-2">
                    {a.note}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Appendix A ────────────────────────────────────────────── */}
          <section id="appendix-a" className="scroll-mt-24">
            <div className="flex items-baseline gap-4 border-b border-ink pb-3 sm:gap-6">
              <span className="shrink-0 font-mono text-[0.8125rem] font-medium text-ink-3">App. A</span>
              <h2 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[1.875rem]">
                {appendix.title}
              </h2>
            </div>
            <p className="mt-3 font-sans text-[0.8125rem] text-ink-3">{appendix.note}</p>
            <dl className="mt-6 divide-y divide-rule-2 border-y border-rule-2">
              {appendix.rows.map(r => (
                <div key={r.term} className="grid gap-x-8 gap-y-1 py-3.5 sm:grid-cols-[10rem_1fr]">
                  <dt className="font-mono text-[0.8125rem] tabular-nums text-ink-2">{r.term}</dt>
                  <dd className="text-[1rem] leading-relaxed text-ink">{r.focus}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>

      <footer className="border-t border-ink bg-plate">
        {/* The footer is the last thing on the page, so its bottom padding is where the home
            indicator would land. */}
        <div className="mx-auto max-w-6xl pt-12 pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+3rem)] sm:pt-14 sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)] sm:pb-[calc(env(safe-area-inset-bottom,0px)+3.5rem)]">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-3">
            End of report
          </p>

          <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-2">
            <div>
              <p className="measure text-[1.0625rem] leading-[1.7] text-ink">{report.title}</p>
              <p className="mt-3 font-sans text-[0.8125rem] text-ink-2">
                {report.kind}
                <span className="mx-1.5 text-ink-3">/</span>
                {report.span}
              </p>
              <p className="mt-6 font-sans text-[0.75rem] leading-relaxed text-ink-3">
                {report.confidentiality}
              </p>
            </div>

            <div className="lg:justify-self-end">
              <dl className="grid grid-cols-2 gap-x-10 gap-y-5">
                <div>
                  <dt className="field-label">Submitted by</dt>
                  <dd className="mt-1 font-sans text-[0.875rem] text-ink">{student.name}</dd>
                  <dd className="font-sans text-[0.75rem] text-ink-3">
                    Student ID {student.studentId}
                  </dd>
                </div>
                <div>
                  <dt className="field-label">Date</dt>
                  <dd className="mt-1 font-sans text-[0.875rem] text-ink">
                    {report.submissionDate}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="field-label">Contact</dt>
                  <dd className="mt-1">
                    {/* The padding and its equal negative margin buy a 46px tap box around a
                        line of 18px text without moving the line or the grid it sits in. */}
                    <a href={`mailto:${student.email}`} className="-my-3.5 inline-block py-3.5 font-sans text-[0.875rem] text-ink underline decoration-rule underline-offset-2 transition-colors hover:text-seal hover:decoration-seal">
                      {student.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-9">
                <p className="signature">{student.name}</p>
                <div className="mt-3 w-64 border-t border-ink" />
                <p className="mt-2 font-sans text-[0.75rem] text-ink-3">
                  {report.institution}
                  <span className="mx-1.5">/</span>
                  {report.school}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

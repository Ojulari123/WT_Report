'use client'

import { useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { stateLabel, type GoalState } from '@/content/report'
import { cn } from '@/lib/utils'

interface SectionHeadProps {
  num: string
  title: string
  sub?: string
  id?: string
}

/* ── Numbered section head ──────────────────────────────────────────────
   The number is not decoration. The table of contents and the figure
   captions both reference it, which is why it replaces an eyebrow rather
   than sitting on top of one. */
export function SectionHead({ num, title, sub, id }: SectionHeadProps) {
  return (
    <header id={id} className="scroll-mt-24">
      <div className="flex items-baseline gap-4 border-b border-ink pb-3 sm:gap-6">
        <span className="font-mono text-[0.8125rem] font-medium tabular-nums text-ink-3">{num}</span>
        <h2 className="flex-1 text-[1.5rem] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[1.875rem]">
          {title}
        </h2>
      </div>
      {sub && <p className="mt-3 font-sans text-[0.8125rem] text-ink-3">{sub}</p>}
    </header>
  )
}

interface FieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

/* ── Metadata field, sans against serif body ─────────────────────────────
   The wrapper takes the caller's spacing rather than being nested inside a
   second div: a dl may contain one div between it and a dt/dd group, and two
   breaks the term-to-definition association outright. */
export function Field({ label, children, className }: FieldProps) {
  return (
    <div className={className}>
      <dt className="field-label">{label}</dt>
      <dd className="mt-1 font-sans text-[0.875rem] leading-snug text-ink">{children}</dd>
    </div>
  )
}

interface MarginNoteProps {
  anchor: string
  children: React.ReactNode
}

/* ── Tufte-style margin note ────────────────────────────────────────────
   Sits in the right margin on wide viewports, folds inline beneath the
   prose on narrow ones. */
export function MarginNote({ anchor, children }: MarginNoteProps) {
  return (
    <aside className="border-l border-rule pl-4">
      <p className="field-label">{anchor}</p>
      <p className="mt-1.5 font-sans text-[0.8125rem] leading-relaxed text-ink-2">{children}</p>
    </aside>
  )
}

interface StateMarkProps {
  state: GoalState | 'na'
  withLabel?: boolean
}

/* ── Typographic state mark ──────────────────────────────────────────────
   State is carried by fill, not by hue, so the page keeps a single accent.
   The accent is spent only on "unmet", which is the state that wants
   attention. */
export function StateMark({ state, withLabel = true }: StateMarkProps) {
  const mark = () => {
    switch (state) {
      case 'met':
        return <span className="block h-2.5 w-2.5 bg-ink" />
      case 'partial':
        return <span className="block h-2.5 w-2.5 border border-ink bg-[linear-gradient(90deg,var(--ink)_50%,transparent_50%)]" />
      case 'unmet':
        return <span className="block h-2.5 w-2.5 border border-seal bg-transparent" />
      default:
        return <span className="block h-px w-2.5 bg-rule" />
    }
  }

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span className="flex h-2.5 w-2.5 items-center justify-center" aria-hidden="true">
        {mark()}
      </span>
      {withLabel && (
        <span className={cn('font-mono text-[0.6875rem] font-medium uppercase tracking-[0.07em]', state === 'unmet' ? 'text-seal' : 'text-ink-2')}>
          {stateLabel[state]}
        </span>
      )}
    </span>
  )
}

export function StateKey() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {(['met', 'partial', 'unmet', 'na'] as const).map(s => <StateMark key={s} state={s} />)}
    </div>
  )
}

interface FigureProps {
  id?: string
  ref_: string
  caption: string
  children: React.ReactNode
  tight?: boolean
}

/* ── Figure frame with a numbered caption ───────────────────────────────── */
export function Figure({ id, ref_, caption, children, tight }: FigureProps) {
  return (
    <figure id={id} className="scroll-mt-24">
      <div className={cn('border border-rule bg-plate', tight ? '' : 'p-5 sm:p-7')}>
        {children}
      </div>
      <figcaption className="mt-2.5 flex gap-2.5 font-sans text-[0.75rem] leading-relaxed text-ink-3">
        <span className="shrink-0 font-mono font-medium text-ink-2">{ref_}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}

interface PlateProps {
  src: StaticImageData
  alt: string
  caption: string
  ref_: string
  className?: string
}

/* ── Employer mark plate ────────────────────────────────────────────────────
   The plates are brand marks, not photographs, so the image is contained and
   centred rather than cropped to fill: object-cover would cut the ends off a wide
   wordmark. The inner field carries the same paper colour the four canvases were
   normalised onto, so the padding around a mark and the canvas behind it are one
   surface rather than two shades meeting at an edge.

   sizes tracks the real column: the plate sits in the 19rem sidebar at lg, is capped at
   24rem between sm and lg, and spans the content measure below that. Nothing here is
   marked priority, because the largest contentful paint is the cover title, which is
   type; preloading a plate that sits several screens down only competes with it for
   bandwidth. */
export function Plate({ src, alt, caption, ref_, className = '' }: PlateProps) {
  return (
    <figure className={className}>
      <div className="border border-rule bg-plate p-1.5">
        <div className="flex aspect-[4/3] items-center justify-center bg-paper p-4 sm:p-5">
          <Image
            src={src}
            alt={alt}
            placeholder="blur"
            loading="lazy"
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 360px, calc(100vw - 62px)"
            className="block h-full w-full object-contain"
          />
        </div>
      </div>
      <figcaption className="mt-2.5 flex gap-2.5 font-sans text-[0.75rem] leading-relaxed text-ink-3">
        <span className="shrink-0 font-mono font-medium text-ink-2">{ref_}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  )
}

interface DisclosureProps {
  id: string
  summary: React.ReactNode
  meta?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}

/* ── Disclosure ─────────────────────────────────────────────────────────
   Uses typographic plus and minus rather than an icon. No icon library is
   available in this sandbox, and hand-rolled icon paths are worse than the
   correct typographic mark. */
export function Disclosure({ id, summary, meta, defaultOpen = false, children }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-rule-2 last:border-b-0">
      {/* The row wraps below sm. A goal title set beside a nowrap state mark is left with
          about 190px at 390px and breaks into five short lines, so at small sizes the mark
          takes a line of its own under the summary, indented to the summary's own left edge.
          From sm the three parts sit on one line, as before. */}
      <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls={id} className="group flex w-full flex-wrap items-start gap-x-4 gap-y-2 py-4 text-left transition-colors duration-200 hover:bg-plate sm:flex-nowrap sm:gap-x-6">
        <span className="mt-[0.1875rem] flex h-4 w-4 shrink-0 items-center justify-center font-mono text-[0.9375rem] leading-none text-ink-3 transition-colors group-hover:text-ink">
          {open ? '−' : '+'}
        </span>
        <span className="min-w-0 grow basis-[calc(100%-2rem)] sm:basis-0">{summary}</span>
        {meta && <span className="shrink-0 pl-8 sm:pl-0 sm:pt-0.5">{meta}</span>}
      </button>
      <div id={id} hidden={!open} className="pb-6 pl-8 sm:pl-10">
        {children}
      </div>
    </div>
  )
}

interface TechMarkProps {
  name: string
  slug: string
}

/* ── Technology mark ────────────────────────────────────────────────────
   Real brand marks from Simple Icons rather than text-only pills. Falls
   back to the name alone if a slug is missing from the CDN. */
export function TechMark({ name, slug }: TechMarkProps) {
  const [broken, setBroken] = useState(false)

  return (
    <span className="inline-flex items-center gap-2 border border-rule bg-plate px-2.5 py-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element -- a 13px remote SVG brand mark: the optimizer refuses SVG without dangerouslyAllowSVG, so routing it through next/image would add a proxy hop and buy nothing */}
      {!!slug && !broken && <img src={`https://cdn.simpleicons.org/${slug}/4a5057`} alt="" aria-hidden="true" width={13} height={13} className="block h-[0.8125rem] w-[0.8125rem]" onError={() => setBroken(true)} />}
      <span className="font-mono text-[0.75rem] text-ink-2">{name}</span>
    </span>
  )
}

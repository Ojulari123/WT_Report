'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/*
 * Set as an erratum slip rather than an error screen: same paper, same rules, same three
 * faces. The digest is printed because it is the only handle a reader has when reporting
 * a fault in a submitted document.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center py-16 pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]">
      <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-ink-3">Erratum</p>
      <h1 className="mt-6 max-w-2xl text-[clamp(1.875rem,5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink">
        This part of the report failed to render.
      </h1>
      <p className="measure mt-6 text-[1.0625rem] leading-[1.75] text-ink-2">
        Nothing in the document was lost. Rendering it again is usually enough; if it is not,
        the digest below identifies the failure.
      </p>

      <dl className="mt-10 max-w-2xl border-t border-ink pt-5">
        <div className="grid gap-x-8 gap-y-1 sm:grid-cols-[10rem_1fr]">
          <dt className="field-label">Digest</dt>
          <dd className="font-mono text-[0.8125rem] text-ink-2">{error.digest ?? 'not recorded'}</dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button type="button" onClick={reset} className="inline-flex w-fit items-center gap-2.5 border border-ink bg-ink px-5 py-2.5 font-sans text-[0.875rem] font-medium text-paper transition-colors duration-200 hover:bg-ink-2">
          Render it again
        </button>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a boundary that failed to render wants a clean document load, not a client transition through the router that just threw */}
        <a href="/" className="font-sans text-[0.875rem] text-ink underline decoration-rule underline-offset-2 transition-colors hover:text-seal hover:decoration-seal">
          Return to the cover
        </a>
      </div>
    </main>
  )
}

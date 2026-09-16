/*
 * The report is one document at one address, so anything else is a page that was never
 * bound into it. Set in the same language as the cover.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center py-16 pl-[calc(env(safe-area-inset-left,0px)+1.5rem)] pr-[calc(env(safe-area-inset-right,0px)+1.5rem)] sm:pl-[calc(env(safe-area-inset-left,0px)+2.5rem)] sm:pr-[calc(env(safe-area-inset-right,0px)+2.5rem)]">
      <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-ink-3">404</p>
      <h1 className="mt-6 max-w-2xl text-[clamp(1.875rem,5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink">
        There is no such page in this report.
      </h1>
      <p className="measure mt-6 text-[1.0625rem] leading-[1.75] text-ink-2">
        The report is a single document. Every section, exhibit, table and appendix is reached
        from the contents on the front page.
      </p>

      <div className="mt-10">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- the report is one document at one address, so this is a plain return to it and not worth pulling the router runtime into every page load */}
        <a href="/" className="inline-flex w-fit items-center gap-2.5 border border-ink bg-ink px-5 py-2.5 font-sans text-[0.875rem] font-medium text-paper transition-colors duration-200 hover:bg-ink-2">
          Return to the cover
          <span aria-hidden="true" className="text-[1rem] leading-none">
            &#8594;
          </span>
        </a>
      </div>
    </main>
  )
}

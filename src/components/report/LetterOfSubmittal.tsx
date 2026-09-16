import { letter } from '@/content/report'

/* A signed letter addressed to the report coordinator. This is a genuine work term
   report convention rather than an invention: Waterloo's Civil and Mechanical
   programmes require one and require it signed. It is also the single element that
   most quickly identifies the document as a work term report. */
export function LetterOfSubmittal() {
  return (
    <section id="letter" className="scroll-mt-24">
      <div className="border border-rule bg-plate px-6 py-10 sm:px-12 sm:py-14">
        <div className="mx-auto max-w-[36rem]">
          <p className="text-right font-sans text-[0.8125rem] text-ink-2">{letter.date}</p>

          <address className="mt-10 not-italic">
            {letter.address.map(line => (
              <span key={line} className="block font-sans text-[0.875rem] leading-relaxed text-ink">
                {line}
              </span>
            ))}
          </address>

          <p className="mt-9 text-[1.0625rem] text-ink">{letter.salutation}</p>

          <div className="mt-5 space-y-4">
            {letter.body.map((para, i) => (
              <p key={i} className="text-[1.0625rem] leading-[1.68] text-ink">
                {para}
              </p>
            ))}
          </div>

          <p className="mt-9 text-[1.0625rem] text-ink">{letter.closing}</p>

          <div className="mt-5">
            <p className="signature">{letter.signatory}</p>
            <div className="mt-3 w-56 border-t border-ink" />
            <p className="mt-2 font-sans text-[0.8125rem] text-ink">{letter.signatory}</p>
            <p className="font-sans text-[0.75rem] text-ink-3">{letter.signatoryMeta}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

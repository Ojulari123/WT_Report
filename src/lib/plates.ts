import type { StaticImageData } from 'next/image'
import term1 from '@/assets/plates/term-1.png'
import term2 from '@/assets/plates/term-2.png'
import term3 from '@/assets/plates/term-3.png'
import term4 from '@/assets/plates/term-4.png'

export type PlateKey = 'term1' | 'term2' | 'term3' | 'term4'

/* Keys are term-ordinal. Each plate is the employer's own mark rather than a stock
   photograph: term-1 the Raa i.T. logo off the Cyraatek contract, term-2 the Jren Energy
   letterhead off the offer of placement, term-3 the Badger Redwood logo off the scanned
   offer letter and term-4 the Value-N-Action lockup from the firm's own site assets. All
   four are trimmed to their content, keyed onto the paper colour and centred on the same
   1200x900 canvas, so four very different aspect ratios read at comparable optical size.
   Imported rather than served from public/ so the build derives intrinsic dimensions and a
   blur placeholder from the file itself, and so the originals never ship as-is. */
export const plateSrc: Record<PlateKey, StaticImageData> = {
  term1,
  term2,
  term3,
  term4,
}

import type { StaticImageData } from 'next/image'
import term1 from '@/assets/plates/term-1.jpg'
import term2 from '@/assets/plates/term-2.jpg'
import term3 from '@/assets/plates/term-3.jpg'
import term4 from '@/assets/plates/term-4.jpg'

export type PlateKey = 'term1' | 'term2' | 'term3' | 'term4'

/* Keys are term-ordinal, not photograph-ordinal: the source files in assets/generated/ were
   named in the order they were generated, which no longer matches the order of the placements.
   The mapping was corrected on copy, so these bindings are the honest ones.
   Imported rather than served from public/ so the build derives intrinsic dimensions and a
   blur placeholder from the file itself, and so the originals never ship as-is. */
export const plateSrc: Record<PlateKey, StaticImageData> = {
  term1,
  term2,
  term3,
  term4,
}

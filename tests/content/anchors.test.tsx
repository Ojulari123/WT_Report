import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WorkTermReportSite } from '@/components/report/WorkTermReportSite'
import { contents, figures } from '@/content/report'

/* Every row in the front matter is a jump target. A stale anchor is a dead row that
   looks live, which is worse than no row, so the whole document is rendered and each
   anchor is resolved against it. */
describe('front matter anchors', () => {
  it.each(contents.map(row => [row.title, row.anchor]))(
    'contents row %s points at an element that exists',
    (_title, anchor) => {
      const { container } = render(<WorkTermReportSite />)
      expect(container.ownerDocument.getElementById(anchor)).not.toBeNull()
    }
  )

  it.each(figures.map(row => [row.ref, row.anchor]))(
    'figure row %s points at an element that exists',
    (_ref, anchor) => {
      const { container } = render(<WorkTermReportSite />)
      expect(container.ownerDocument.getElementById(anchor)).not.toBeNull()
    }
  )

  it('renders each anchor exactly once', () => {
    render(<WorkTermReportSite />)
    const anchors = [...new Set([...contents.map(r => r.anchor), ...figures.map(r => r.anchor)])]
    for (const anchor of anchors) {
      expect(document.querySelectorAll(`#${CSS.escape(anchor)}`), `#${anchor}`).toHaveLength(1)
    }
  })
})

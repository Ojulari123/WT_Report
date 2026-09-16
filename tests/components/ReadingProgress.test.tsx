import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WorkTermReportSite } from '@/components/report/WorkTermReportSite'

/* jsdom reports zero for every scroll metric, so the document is given a shape before
   each render. The fallback reads documentElement directly, which is what is faked here.
   jsdom also ships a CSS object without supports(), which is the unsupported branch by
   accident, so each test states which branch it means. */
const metrics = ['scrollHeight', 'clientHeight', 'scrollTop'] as const

function shapeDocument(scrollHeight: number, clientHeight: number, scrollTop: number) {
  const values: Record<string, number> = { scrollHeight, clientHeight, scrollTop }
  for (const key of metrics) {
    Object.defineProperty(document.documentElement, key, {
      configurable: true,
      get: () => values[key],
      set: (next: number) => {
        values[key] = next
      },
    })
  }
  return (next: number) => {
    values.scrollTop = next
  }
}

function bar() {
  const el = document.querySelector<HTMLElement>('.reading-progress')
  if (!el) throw new Error('no .reading-progress element')
  return el
}

async function nextFrame() {
  await act(async () => {
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => resolve())
    })
  })
}

afterEach(() => {
  for (const key of metrics) {
    Reflect.deleteProperty(document.documentElement, key)
  }
})

describe('reading progress fallback', () => {
  it('writes the scroll fraction where the CSS scroll timeline is unavailable', async () => {
    const scrollTo = shapeDocument(3000, 1000, 500)
    render(<WorkTermReportSite />)
    expect(bar().style.transform).toBe('scaleX(0.25)')

    scrollTo(1000)
    window.dispatchEvent(new Event('scroll'))
    await nextFrame()
    expect(bar().style.transform).toBe('scaleX(0.5)')
  })

  it('coalesces a burst of scroll events into one write', async () => {
    const scrollTo = shapeDocument(3000, 1000, 0)
    const frames = vi.spyOn(window, 'requestAnimationFrame')
    render(<WorkTermReportSite />)

    scrollTo(400)
    for (let i = 0; i < 8; i += 1) window.dispatchEvent(new Event('scroll'))
    expect(frames).toHaveBeenCalledTimes(1)

    await nextFrame()
    expect(bar().style.transform).toBe('scaleX(0.2)')
  })

  it('clamps past the foot of the document and never exceeds full width', async () => {
    shapeDocument(3000, 1000, 9999)
    render(<WorkTermReportSite />)
    expect(bar().style.transform).toBe('scaleX(1)')
  })

  it('shows nothing on a document with no scroll span', async () => {
    shapeDocument(900, 900, 0)
    render(<WorkTermReportSite />)
    expect(bar().style.transform).toBe('scaleX(0)')
  })

  it('does not attach where CSS drives the bar', async () => {
    shapeDocument(3000, 1000, 500)
    const listen = vi.spyOn(window, 'addEventListener')
    vi.stubGlobal('CSS', { ...CSS, supports: () => true })

    render(<WorkTermReportSite />)

    expect(bar().style.transform).toBe('')
    const scrollRegistrations = listen.mock.calls.filter(([type]) => type === 'scroll')
    expect(scrollRegistrations).toEqual([])
  })

  it('stays inert when the reader prefers reduced motion', async () => {
    shapeDocument(3000, 1000, 500)
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }))

    render(<WorkTermReportSite />)

    expect(bar().style.transform).toBe('')
  })

  it('removes its listener when the report unmounts', async () => {
    const scrollTo = shapeDocument(3000, 1000, 0)
    const { unmount } = render(<WorkTermReportSite />)
    /* Held across the unmount on purpose: a listener that survived teardown would keep
       writing to this detached node, and the stale reference is the only way to see it. */
    const detached = bar()
    expect(detached.style.transform).toBe('scaleX(0)')

    unmount()
    scrollTo(1000)
    window.dispatchEvent(new Event('scroll'))
    await nextFrame()

    expect(detached.style.transform).toBe('scaleX(0)')
  })
})

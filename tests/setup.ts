import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

/* Network lockdown. A component that reaches for a remote icon in a unit test is a
   defect, not a detail, so fetch fails loudly instead of silently resolving. */
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      throw new Error(`Unexpected network request in a unit test: ${String(input)}`)
    })
  )
})

afterEach(() => {
  cleanup()
})

/* jsdom ships none of these three and the report uses all of them. */
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}

class NoopObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

if (typeof window.IntersectionObserver === 'undefined') {
  window.IntersectionObserver = NoopObserver as unknown as typeof IntersectionObserver
}

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = NoopObserver as unknown as typeof ResizeObserver
}

import '@testing-library/jest-dom/vitest'

// Mock de matchMedia para framer-motion / testing-library en jsdom.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}

// Mock de scrollTo (jsdom no lo implementa).
const win = window as unknown as Record<string, unknown>
if (!('scrollTo' in window)) {
  win.scrollTo = () => undefined
}

// Mock de IntersectionObserver (usado por framer-motion) en jsdom.
if (!('IntersectionObserver' in window)) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    constructor(
      private readonly callback: IntersectionObserverCallback,
      _options?: IntersectionObserverInit,
    ) {}
    observe(target: Element): void {
      this.callback(
        [
          {
            isIntersecting: true,
            target,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 1,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            time: 0,
          } as IntersectionObserverEntry,
        ],
        this,
      )
    }
    unobserve(): void {
      return undefined
    }
    disconnect(): void {
      return undefined
    }
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  win.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
  globalThis.IntersectionObserver = win.IntersectionObserver as typeof IntersectionObserver
}

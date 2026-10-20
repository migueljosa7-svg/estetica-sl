/** Carrousel horizontal de productos del catálogo. */
import { useCallback, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/Reveal'
import { useStore } from '@/context/StoreContext'

interface ProductCarouselProps {
  /** Productos mostrados por página (mínimo 1, máximo 4). */
  perPage?: number
  /** Desplazamiento vertical adicional aplicado al arrastrar. */
  verticalOffset?: number
}

const MIN_PER_PAGE = 1
const MAX_PER_PAGE = 4
const CARD_WIDTH = 280
const GAP = 24
const SCROLL_TYPE = 'smooth'

export function ProductCarousel({
  perPage = 3,
  verticalOffset = 24,
}: ProductCarouselProps) {
  const { products } = useStore()
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const visibleCount = Math.min(
    Math.max(perPage, MIN_PER_PAGE),
    MAX_PER_PAGE,
    products.length,
  )
  const totalPages = Math.max(1, Math.ceil(products.length / visibleCount))

  const goTo = useCallback(
    (page: number) => {
      const clamped = Math.max(0, Math.min(page, totalPages - 1))
      setActiveIndex(clamped)
      if (ref.current) {
        const offset = clamped * (CARD_WIDTH + GAP) + verticalOffset / 2
        ref.current.scrollTo({
          left: offset,
          behavior: reduced ? 'auto' : 'smooth',
        })
      }
    },
    [reduced, totalPages, verticalOffset],
  )

  const next = useCallback(() => {
    goTo(activeIndex + 1)
  }, [activeIndex, goTo])

  const prev = useCallback(() => {
    goTo(activeIndex - 1)
  }, [activeIndex, goTo])

  const onScroll = useCallback(() => {
    if (!ref.current) return
    const index = Math.round(
      ref.current.scrollLeft / (CARD_WIDTH + GAP),
    )
    const clamped = Math.max(0, Math.min(index, totalPages - 1))
    setActiveIndex(clamped)
  }, [totalPages])

  if (products.length === 0) return null

  return (
    <div className="overflow-hidden">
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto px-4 sm:px-0"
        style={{
          scrollSnapType: 'x mandatory',
          scrollBehavior: SCROLL_TYPE,
          display: 'flex',
        }}
        onScroll={onScroll}
        role="region"
        aria-label="Carrusel de productos"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-[280px] snap-start"
            style={{ width: CARD_WIDTH }}
          >
            <Reveal delay={0.05}>
              <ProductCard product={product} />
            </Reveal>
          </div>
        ))}
      </div>

      {products.length > visibleCount && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Producto anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-beige-300 text-tinta-700 transition-colors hover:border-oro-400 hover:text-oro-500"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-xs text-tinta-700">
            <span>
              {activeIndex * visibleCount + 1}-
              {Math.min((activeIndex + 1) * visibleCount, products.length)} de{' '}
              {products.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Página {activeIndex + 1} de {totalPages}
            </span>
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Producto siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-beige-300 text-tinta-700 transition-colors hover:border-oro-400 hover:text-oro-500"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

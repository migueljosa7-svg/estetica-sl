/**
 * Carrusel editorial con flechas, indicadores, gestos táctiles,
 * autoplay opcional y soporte de teclado. Respeta prefers-reduced-motion.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { LazyImage } from './LazyImage'
import { cx } from '@/lib/format'
import type { CarouselSlide } from '@/lib/types'

const AUTOPLAY_MS = 6000

interface CarouselProps {
  slides: CarouselSlide[]
}

export function Carousel({ slides }: CarouselProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const total = slides.length

  const goTo = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  )

  useEffect(() => {
    if (reduced || !playing || total <= 1) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reduced, playing, total])

  if (total === 0) return null
  const slide = slides[Math.min(index, total - 1)]

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goTo(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goTo(index + 1)
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) > 48) goTo(index + (delta < 0 ? 1 : -1))
  }

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Novedades destacadas"
      className="group/carousel relative overflow-hidden rounded-3xl"
      onMouseEnter={() => playing && setPlaying(false)}
      onFocus={() => playing && setPlaying(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onKeyDown}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.7, ease: 'easeInOut' }}
          >
            <LazyImage
              src={slide.image}
              alt={slide.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="h-full w-full"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-tinta-900/70 via-tinta-900/20 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
              <h3 className="text-balance-site font-display text-2xl font-light text-marfil-50 sm:text-3xl lg:text-4xl">
                {slide.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm font-light text-marfil-100/90 sm:text-base">
                {slide.subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Diapositiva anterior"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 bg-tinta-900/40 p-2.5 text-white opacity-0 backdrop-blur transition-all hover:bg-tinta-900/70 focus-visible:opacity-100 group-hover/carousel:opacity-100 sm:left-5"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente diapositiva"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 bg-tinta-900/40 p-2.5 text-white opacity-0 backdrop-blur transition-all hover:bg-tinta-900/70 focus-visible:opacity-100 group-hover/carousel:opacity-100 sm:right-5"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 sm:bottom-6 sm:right-6">
            <div role="tablist" aria-label="Seleccionar diapositiva" className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ir a la diapositiva ${i + 1}: ${s.title}`}
                  onClick={() => goTo(i)}
                  className={cx(
                    'h-2 rounded-full transition-all duration-300',
                    i === index ? 'w-7 bg-marfil-50' : 'w-2 bg-marfil-50/50 hover:bg-marfil-50/80',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pausar reproducción automática' : 'Reproducir automáticamente'}
              aria-pressed={playing}
              className="rounded-full border border-white/40 bg-tinta-900/40 p-1.5 text-white backdrop-blur transition-colors hover:bg-tinta-900/70"
            >
              {playing ? (
                <Pause aria-hidden="true" className="h-3.5 w-3.5" />
              ) : (
                <Play aria-hidden="true" className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </>
      )}
      <p aria-live="polite" className="sr-only">
        Diapositiva {index + 1} de {total}: {slide.title}
      </p>
    </section>
  )
}


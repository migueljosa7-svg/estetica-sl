/**
 * StoreContext — fuente única de datos de la demo.
 * Carga los JSON base y los fusiona con los overrides del localStorage
 * (ediciones hechas desde /admin). Incluye acciones CRUD y restablecer.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import baseCategories from '@/data/categories.json'
import baseProducts from '@/data/products.json'
import baseTreatments from '@/data/treatments.json'
import baseTestimonials from '@/data/testimonials.json'
import baseFaq from '@/data/faq.json'
import baseSlides from '@/data/slides.json'
import baseTexts from '@/data/site.json'
import { STORAGE_KEYS, readStorage, removeStorage, writeStorage } from '@/lib/storage'
import type {
  Category,
  FaqItem,
  Product,
  SiteTexts,
  StoreData,
  StoreOverrides,
  Testimonial,
  Treatment,
  CarouselSlide,
} from '@/lib/types'

export function buildBaseData(): StoreData {
  return {
    categories: baseCategories as Category[],
    products: baseProducts as Product[],
    treatments: baseTreatments as Treatment[],
    testimonials: baseTestimonials as Testimonial[],
    faq: baseFaq as FaqItem[],
    slides: baseSlides as CarouselSlide[],
    texts: baseTexts as SiteTexts,
  }
}

export function mergeStore(base: StoreData, overrides: StoreOverrides): StoreData {
  return {
    categories: overrides.categories ?? base.categories,
    products: overrides.products ?? base.products,
    treatments: overrides.treatments ?? base.treatments,
    testimonials: overrides.testimonials ?? base.testimonials,
    faq: overrides.faq ?? base.faq,
    slides: overrides.slides ?? base.slides,
    texts: overrides.texts ? { ...base.texts, ...overrides.texts } : base.texts,
  }
}

interface StoreContextValue extends StoreData {
  /** true si hay overrides guardados en este navegador. */
  isCustomized: boolean
  saveProducts: (products: Product[]) => void
  saveCategories: (categories: Category[]) => void
  saveTreatments: (treatments: Treatment[]) => void
  saveTexts: (texts: SiteTexts) => void
  saveSlides: (slides: CarouselSlide[]) => void
  resetAll: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<StoreOverrides>(() =>
    readStorage<StoreOverrides>(STORAGE_KEYS.store, {}),
  )
  const isCustomized = Object.keys(overrides).length > 0

  const persist = useCallback((next: StoreOverrides) => {
    setOverrides(next)
    if (Object.keys(next).length === 0) {
      removeStorage(STORAGE_KEYS.store)
    } else {
      writeStorage(STORAGE_KEYS.store, next)
    }
  }, [])

  const base = useMemo(() => buildBaseData(), [])
  const data = useMemo(() => mergeStore(base, overrides), [base, overrides])

  const value = useMemo<StoreContextValue>(
    () => ({
      ...data,
      isCustomized,
      saveProducts: (products) => persist({ ...overrides, products }),
      saveCategories: (categories) => persist({ ...overrides, categories }),
      saveTreatments: (treatments) => persist({ ...overrides, treatments }),
      saveTexts: (texts) => persist({ ...overrides, texts }),
      saveSlides: (slides) => persist({ ...overrides, slides }),
      resetAll: () => persist({}),
    }),
    [data, isCustomized, overrides, persist],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de <StoreProvider>')
  return ctx
}

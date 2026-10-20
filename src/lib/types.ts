/**
 * Tipos de dominio de la demo ESTÉTICA GUION.
 * Todos los datos son ficticios y están pensados solo para demostración.
 */

export interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export interface Product {
  id: string
  slug: string
  name: string
  /** Identificador de la categoría a la que pertenece. */
  categoryId: string
  /** Precio en euros. */
  price: number
  /** Precio anterior tachado (opcional) para promociones ficticias. */
  oldPrice?: number
  /** Unidades disponibles en la demo. */
  stock: number
  rating: number
  reviews: number
  image: string
  badge?: string
  shortDescription: string
  description: string
  ingredients: string[]
  usage: string
  featured: boolean
}

export type TreatmentArea = 'facial' | 'corporal'

export interface Treatment {
  id: string
  slug: string
  name: string
  area: TreatmentArea
  /** Precio en euros. */
  price: number
  /** Duración en minutos. */
  duration: number
  /** Nº de sesiones recomendadas (informativo). */
  sessions?: string
  summary: string
  description: string
  benefits: string[]
  image: string
  featured: boolean
}

export interface Testimonial {
  id: string
  name: string
  city: string
  treatment: string
  rating: number
  text: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface CarouselSlide {
  id: string
  image: string
  alt: string
  title: string
  subtitle: string
}

export interface SiteTexts {
  brand: string
  tagline: string
  heroTitle: string
  heroHighlight: string
  heroSubtitle: string
  heroImage: string
  heroAlt: string
  aboutTitle: string
  aboutText: string
  aboutImage: string
  aboutAlt: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  contactHours: string
  /** Aviso de demostración mostrado en el pie y en /admin. */
  demoNotice: string
}

/** Estructura completa que consume la aplicación. */
export interface StoreData {
  categories: Category[]
  products: Product[]
  treatments: Treatment[]
  testimonials: Testimonial[]
  faq: FaqItem[]
  slides: CarouselSlide[]
  texts: SiteTexts
}

/** Partial editable desde el panel de administración. */
export type StoreOverrides = Partial<{
  categories: Category[]
  products: Product[]
  treatments: Treatment[]
  testimonials: Testimonial[]
  faq: FaqItem[]
  slides: CarouselSlide[]
  texts: SiteTexts
}>

export interface CartLine {
  productId: string
  qty: number
}

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name'

/** Validación de formularios del panel de administración (demo). */
import type { Product, Treatment } from './types'

export interface ProductDraft {
  name: string
  slug: string
  categoryId: string
  price: string
  stock: string
  shortDescription: string
  description: string
  ingredients: string
  usage: string
  image: string
  badge: string
  featured: boolean
}

export interface TreatmentDraft {
  name: string
  slug: string
  area: 'facial' | 'corporal'
  price: string
  duration: string
  summary: string
  description: string
  benefits: string
  image: string
  featured: boolean
}

export function validateProductDraft(
  draft: ProductDraft,
  categoryIds: string[],
): Record<string, string> {
  const errors: Record<string, string> = {}
  if (draft.name.trim().length < 2) errors.name = 'El nombre es obligatorio (mín. 2 caracteres).'
  if (!/^[a-z0-9-]+$/.test(draft.slug)) {
    errors.slug = 'El slug solo puede contener minúsculas, números y guiones.'
  }
  if (!categoryIds.includes(draft.categoryId)) errors.categoryId = 'Selecciona una categoría válida.'
  const price = Number(draft.price)
  if (!Number.isFinite(price) || price < 0) errors.price = 'Introduce un precio válido (≥ 0).'
  const stock = Number(draft.stock)
  if (!Number.isInteger(stock) || stock < 0) errors.stock = 'El stock debe ser un entero ≥ 0.'
  if (draft.shortDescription.trim().length < 10) {
    errors.shortDescription = 'La descripción corta necesita al menos 10 caracteres.'
  }
  if (draft.description.trim().length < 20) {
    errors.description = 'La descripción necesita al menos 20 caracteres.'
  }
  if (draft.usage.trim().length < 5) errors.usage = 'Indica el modo de uso.'
  if (!draft.image.trim()) errors.image = 'Indica la ruta de la imagen.'
  return errors
}

export function validateTreatmentDraft(draft: TreatmentDraft): Record<string, string> {
  const errors: Record<string, string> = {}
  if (draft.name.trim().length < 2) errors.name = 'El nombre es obligatorio (mín. 2 caracteres).'
  if (!/^[a-z0-9-]+$/.test(draft.slug)) {
    errors.slug = 'El slug solo puede contener minúsculas, números y guiones.'
  }
  const price = Number(draft.price)
  if (!Number.isFinite(price) || price < 0) errors.price = 'Introduce un precio válido (≥ 0).'
  const duration = Number(draft.duration)
  if (!Number.isInteger(duration) || duration <= 0) errors.duration = 'La duración debe ser > 0 minutos.'
  if (draft.summary.trim().length < 10) errors.summary = 'El resumen necesita al menos 10 caracteres.'
  if (draft.description.trim().length < 20) errors.description = 'La descripción necesita al menos 20 caracteres.'
  if (!draft.image.trim()) errors.image = 'Indica la ruta de la imagen.'
  return errors
}

/** Convierte un producto en un borrador editable. */
export function productToDraft(p: Product): ProductDraft {
  return {
    name: p.name,
    slug: p.slug,
    categoryId: p.categoryId,
    price: String(p.price),
    stock: String(p.stock),
    shortDescription: p.shortDescription,
    description: p.description,
    ingredients: p.ingredients.join(', '),
    usage: p.usage,
    image: p.image,
    badge: p.badge ?? '',
    featured: p.featured,
  }
}

/** Aplica un borrador validado sobre un producto (conserva id, rating y reseñas). */
export function draftToProduct(draft: ProductDraft, base: Product): Product {
  return {
    ...base,
    name: draft.name.trim(),
    slug: draft.slug.trim(),
    categoryId: draft.categoryId,
    price: Number(draft.price),
    stock: Number(draft.stock),
    shortDescription: draft.shortDescription.trim(),
    description: draft.description.trim(),
    ingredients: draft.ingredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    usage: draft.usage.trim(),
    image: draft.image.trim(),
    badge: draft.badge.trim() || undefined,
    featured: draft.featured,
  }
}

export function treatmentToDraft(t: Treatment): TreatmentDraft {
  return {
    name: t.name,
    slug: t.slug,
    area: t.area,
    price: String(t.price),
    duration: String(t.duration),
    summary: t.summary,
    description: t.description,
    benefits: t.benefits.join(', '),
    image: t.image,
    featured: t.featured,
  }
}

export function draftToTreatment(draft: TreatmentDraft, base: Treatment): Treatment {
  return {
    ...base,
    name: draft.name.trim(),
    slug: draft.slug.trim(),
    area: draft.area,
    price: Number(draft.price),
    duration: Number(draft.duration),
    summary: draft.summary.trim(),
    description: draft.description.trim(),
    benefits: draft.benefits
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    image: draft.image.trim(),
    featured: draft.featured,
  }
}

/** Genera un id nuevo con prefijo para elementos creados en la demo. */
export function newId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now().toString(36)}-${random}`
}

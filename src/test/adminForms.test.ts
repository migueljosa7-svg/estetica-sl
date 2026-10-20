import { describe, expect, it } from 'vitest'
import {
  draftToProduct,
  draftToTreatment,
  newId,
  validateProductDraft,
  validateTreatmentDraft,
} from '@/lib/adminForms'
import type { Product, Treatment } from '@/lib/types'

const BASE_PRODUCT: Product = {
  id: 'p1',
  slug: 'p1',
  name: 'Base',
  categoryId: 'c1',
  price: 10,
  stock: 2,
  rating: 0,
  reviews: 0,
  image: '/i.svg',
  shortDescription: 'corta base de diez o más',
  description: 'descripción base con más de veinte caracteres',
  ingredients: [],
  usage: 'uso base',
  featured: false,
}

const BASE_TREATMENT: Treatment = {
  id: 't1',
  slug: 't1',
  name: 'Base',
  area: 'facial',
  price: 50,
  duration: 60,
  summary: 'resumen base de la demo',
  description: 'descripción base con más de veinte caracteres',
  benefits: [],
  image: '/i.jpg',
  featured: false,
}

describe('validación de formularios admin', () => {
  it('detecta errores en un borrador de producto inválido', () => {
    const errors = validateProductDraft(
      {
        name: '',
        slug: 'Slug Mal',
        categoryId: 'inexistente',
        price: '-5',
        stock: '1.5',
        shortDescription: 'corta',
        description: 'corta',
        ingredients: '',
        usage: '',
        image: '',
        badge: '',
        featured: false,
      },
      ['c1'],
    )
    expect(Object.keys(errors)).toContain('name')
    expect(Object.keys(errors)).toContain('slug')
    expect(Object.keys(errors)).toContain('categoryId')
    expect(Object.keys(errors)).toContain('price')
    expect(Object.keys(errors)).toContain('stock')
  })

  it('acepta un borrador de producto válido y lo aplica al producto', () => {
    const draft = {
      name: 'Nuevo sérum',
      slug: 'nuevo-serum',
      categoryId: 'c1',
      price: '42',
      stock: '5',
      shortDescription: 'Descripción corta suficiente',
      description: 'Descripción completa con más de veinte caracteres.',
      ingredients: 'aloe, vitamina c',
      usage: 'aplicar por la mañana',
      image: '/i.svg',
      badge: 'Nuevo',
      featured: true,
    }
    expect(validateProductDraft(draft, ['c1'])).toEqual({})
    const result = draftToProduct(draft, BASE_PRODUCT)
    expect(result).toMatchObject({ price: 42, stock: 5, featured: true, badge: 'Nuevo' })
    expect(result.ingredients).toEqual(['aloe', 'vitamina c'])
    expect(result.id).toBe('p1') // conserva el id y las reseñas
    expect(result.reviews).toBe(0)
  })

  it('detecta errores en un borrador de tratamiento inválido', () => {
    const errors = validateTreatmentDraft({
      name: '',
      slug: 'MAL',
      area: 'facial',
      price: 'abc',
      duration: '0',
      summary: 'corto',
      description: 'corta',
      benefits: '',
      image: '',
      featured: false,
    })
    expect(Object.keys(errors)).toContain('name')
    expect(Object.keys(errors)).toContain('slug')
    expect(Object.keys(errors)).toContain('price')
    expect(Object.keys(errors)).toContain('duration')
  })

  it('acepta un borrador de tratamiento válido y lo aplica', () => {
    const draft = {
      name: 'Hidrafacial X',
      slug: 'hidrafacial-x',
      area: 'facial' as const,
      price: '89',
      duration: '60',
      summary: 'Resumen válido del tratamiento demo',
      description: 'Descripción completa con más de veinte caracteres.',
      benefits: 'a, b',
      image: '/i.jpg',
      featured: false,
    }
    expect(validateTreatmentDraft(draft)).toEqual({})
    const result = draftToTreatment(draft, BASE_TREATMENT)
    expect(result).toMatchObject({ area: 'facial', price: 89, duration: 60 })
    expect(result.benefits).toEqual(['a', 'b'])
  })

  it('newId genera ids únicos con el prefijo indicado', () => {
    const a = newId('prod')
    const b = newId('prod')
    expect(a.startsWith('prod-')).toBe(true)
    expect(a).not.toBe(b)
  })
})

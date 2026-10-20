import { describe, expect, it } from 'vitest'
import { countByCategory, DEFAULT_FILTERS, filterProducts } from '@/lib/catalog'
import type { Category, Product } from '@/lib/types'

function makeProduct(overrides: Partial<Product> & Pick<Product, 'id'>): Product {
  return {
    slug: overrides.id,
    name: `Producto ${overrides.id}`,
    categoryId: 'c1',
    price: 20,
    stock: 5,
    rating: 4,
    reviews: 1,
    image: '/i.svg',
    shortDescription: 'descripción corta',
    description: 'descripción larga de al menos veinte caracteres',
    ingredients: ['Vitamina C'],
    usage: 'uso diario',
    featured: false,
    ...overrides,
  }
}

const products: Product[] = [
  makeProduct({ id: '1', name: 'Sérum Hidratante Rosa', categoryId: 'c1', price: 40, featured: true }),
  makeProduct({ id: '2', name: 'Crema Corporal', categoryId: 'c2', price: 25, stock: 0, ingredients: ['Karité'] }),
  makeProduct({
    id: '3',
    name: 'Aceite ÁRBOL de té',
    categoryId: 'c1',
    price: 15,
    ingredients: ['Aceite de árbol de té'],
  }),
]

const categories: Category[] = [
  { id: 'c1', name: 'Facial', slug: 'facial', description: '' },
  { id: 'c2', name: 'Corporal', slug: 'corporal', description: '' },
]

describe('catalog lib', () => {
  it('filtra por categoría', () => {
    const r = filterProducts(products, { ...DEFAULT_FILTERS, categoryId: 'c2' })
    expect(r.map((p) => p.id)).toEqual(['2'])
  })

  it('busca ignorando acentos y mayúsculas', () => {
    const r1 = filterProducts(products, { ...DEFAULT_FILTERS, query: 'arbol' })
    expect(r1.map((p) => p.id)).toEqual(['3'])
    const r2 = filterProducts(products, { ...DEFAULT_FILTERS, query: 'SERUM' })
    expect(r2.map((p) => p.id)).toEqual(['1'])
    const r3 = filterProducts(products, { ...DEFAULT_FILTERS, query: 'vitamina c' })
    expect(r3).toHaveLength(1)
  })

  it('filtra solo con stock', () => {
    const r = filterProducts(products, { ...DEFAULT_FILTERS, inStockOnly: true })
    expect(r.map((p) => p.id).sort()).toEqual(['1', '3'])
  })

  it('ordena por precio y nombre', () => {
    const asc = filterProducts(products, { ...DEFAULT_FILTERS, sort: 'price-asc' })
    expect(asc.map((p) => p.price)).toEqual([15, 25, 40])
    const desc = filterProducts(products, { ...DEFAULT_FILTERS, sort: 'price-desc' })
    expect(desc.map((p) => p.price)).toEqual([40, 25, 15])
    const nameAsc = filterProducts(products, { ...DEFAULT_FILTERS, sort: 'name' })
    expect(nameAsc.map((p) => p.id)).toEqual(['3', '2', '1'])
  })

  it('ordena destacados primero por defecto', () => {
    const r = filterProducts(products, DEFAULT_FILTERS)
    expect(r[0].id).toBe('1')
  })

  it('cuenta resultados por categoría', () => {
    const counts = countByCategory(products, categories)
    expect(counts.all).toBe(3)
    expect(counts.c1).toBe(2)
    expect(counts.c2).toBe(1)
  })
})

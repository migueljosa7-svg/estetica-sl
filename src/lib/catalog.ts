/**
 * Lógica pura de filtrado, búsqueda y ordenación del catálogo.
 */
import { normalize } from './format'
import type { Category, Product, SortKey } from './types'

export interface CatalogFilters {
  query: string
  categoryId: string | 'all'
  sort: SortKey
  /** Incluye solo productos con stock > 0. */
  inStockOnly: boolean
}

export const DEFAULT_FILTERS: CatalogFilters = {
  query: '',
  categoryId: 'all',
  sort: 'featured',
  inStockOnly: false,
}

export function filterProducts(
  products: Product[],
  filters: CatalogFilters,
): Product[] {
  const q = normalize(filters.query)
  const filtered = products.filter((p) => {
    if (filters.categoryId !== 'all' && p.categoryId !== filters.categoryId) {
      return false
    }
    if (filters.inStockOnly && p.stock <= 0) return false
    if (q) {
      const haystack = normalize(
        `${p.name} ${p.shortDescription} ${p.description} ${p.ingredients.join(' ')}`,
      )
      if (!haystack.includes(q)) return false
    }
    return true
  })
  return sortProducts(filtered, filters.sort)
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name, 'es'))
    case 'featured':
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured))
  }
}

/** Cuenta resultados por categoría para mostrar contadores en el catálogo. */
export function countByCategory(
  products: Product[],
  categories: Category[],
): Record<string, number> {
  const counts: Record<string, number> = { all: products.length }
  for (const c of categories) {
    counts[c.id] = products.filter((p) => p.categoryId === c.id).length
  }
  return counts
}

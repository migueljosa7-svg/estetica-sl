/** Catálogo de cosmética: categorías, búsqueda, orden, favoritos y estados vacíos. */
import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/Reveal'
import { EmptyState } from '@/components/EmptyState'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import { countByCategory, DEFAULT_FILTERS, filterProducts } from '@/lib/catalog'
import { cx } from '@/lib/format'
import type { SortKey } from '@/lib/types'

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre A–Z' },
]

export function ShopPage() {
  const { products, categories } = useStore()
  const { show } = useToast()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const counts = useMemo(() => countByCategory(products, categories), [products, categories])
  const results = useMemo(() => filterProducts(products, filters), [products, filters])

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-oro-500">
          Tienda de demostración
        </p>
        <h1 className="text-balance-site text-4xl font-light text-tinta-900 sm:text-5xl">
          Cosmética de autor
        </h1>
        <p className="mt-4 max-w-2xl text-base font-light leading-relaxed text-tinta-700">
          Productos ficticios creados para esta demo: precios, stock y descripciones son de
          ejemplo y no corresponden a un catálogo real.
        </p>
      </header>

      {/* Barra de herramientas */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="buscar-producto" className="sr-only">
            Buscar productos
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta-700"
          />
          <input
            id="buscar-producto"
            type="search"
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            placeholder="Buscar por nombre o ingrediente…"
            className="w-full rounded-full border border-beige-300 bg-marfil-50 py-3 pl-11 pr-10 text-sm text-tinta-900 placeholder:text-tinta-700/60 focus:border-oro-400 focus:outline-none"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, query: '' }))}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-tinta-700 hover:bg-beige-100"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-tinta-700">
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-oro-500" />
            <span className="sr-only sm:not-sr-only">Ordenar</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortKey }))}
              className="rounded-full border border-beige-300 bg-marfil-50 px-4 py-2.5 text-sm text-tinta-900 focus:border-oro-400 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-beige-300 bg-marfil-50 px-4 py-2.5 text-sm text-tinta-700">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))}
              className="h-4 w-4 accent-salvia-600"
            />
            Solo con stock
          </label>
        </div>
      </div>

      {/* Categorías */}
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          onClick={() => setFilters((f) => ({ ...f, categoryId: 'all' }))}
          aria-pressed={filters.categoryId === 'all'}
          className={cx(
            'rounded-full px-4 py-2 text-sm transition-colors',
            filters.categoryId === 'all'
              ? 'bg-tinta-900 text-marfil-50'
              : 'border border-beige-300 bg-marfil-50 text-tinta-700 hover:border-oro-400',
          )}
        >
          Todos <span className="opacity-60">({counts.all})</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilters((f) => ({ ...f, categoryId: c.id }))}
            aria-pressed={filters.categoryId === c.id}
            className={cx(
              'rounded-full px-4 py-2 text-sm transition-colors',
              filters.categoryId === c.id
                ? 'bg-tinta-900 text-marfil-50'
                : 'border border-beige-300 bg-marfil-50 text-tinta-700 hover:border-oro-400',
            )}
          >
            {c.name} <span className="opacity-60">({counts[c.id] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Resultados */}
      <p aria-live="polite" className="mb-6 text-sm text-tinta-700">
        {results.length === 1 ? '1 producto' : `${results.length} productos`}
        {filters.query && ` para «${filters.query}»`}
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={<Search aria-hidden="true" className="h-6 w-6" />}
          title="Sin resultados"
          description="No hay productos que coincidan con tu búsqueda. Prueba con otro término o restablece los filtros."
          action={
            <button
              type="button"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
            >
              Restablecer filtros
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i * 0.05, 0.4)}>
              <ProductCard
                product={product}
                onAdded={(name) => show(`${name} añadido a la cesta`)}
              />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

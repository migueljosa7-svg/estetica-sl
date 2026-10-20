/** CRUD de productos del panel de administración (demo, localStorage). */
import { useMemo, useState } from 'react'
import { Check, Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import { cx, formatPrice } from '@/lib/format'
import {
  draftToProduct,
  newId,
  productToDraft,
  validateProductDraft,
  type ProductDraft,
} from '@/lib/adminForms'
import type { Product } from '@/lib/types'

const EMPTY: ProductDraft = {
  name: '',
  slug: '',
  categoryId: 'cat-facial',
  price: '',
  stock: '0',
  shortDescription: '',
  description: '',
  ingredients: '',
  usage: '',
  image: '/images/products/serum-luminar.svg',
  badge: '',
  featured: false,
}

export function AdminProductsTab() {
  const { products, categories, saveProducts } = useStore()
  const { show } = useToast()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [draft, setDraft] = useState<ProductDraft>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, query])

  const categoryIds = categories.map((c) => c.id)

  const startEdit = (p: Product) => {
    setEditing(p)
    setDraft(productToDraft(p))
    setErrors({})
    setPreview(false)
  }

  const startNew = () => {
    setEditing('new')
    setDraft({ ...EMPTY, slug: `producto-${Date.now().toString(36)}` })
    setErrors({})
    setPreview(false)
  }

  const setField = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: '' } : e))
  }

  const save = () => {
    const found = validateProductDraft(draft, categoryIds)
    setErrors(found)
    if (Object.keys(found).some((k) => found[k])) return

    if (editing === 'new') {
      const base: Product = {
        id: newId('prod'),
        slug: draft.slug.trim(),
        name: draft.name.trim(),
        categoryId: draft.categoryId,
        price: Number(draft.price),
        stock: Number(draft.stock),
        rating: 0,
        reviews: 0,
        image: draft.image.trim(),
        shortDescription: draft.shortDescription.trim(),
        description: draft.description.trim(),
        ingredients: [],
        usage: draft.usage.trim(),
        featured: draft.featured,
      }
      saveProducts([...products, draftToProduct(draft, base)])
      show('Producto creado')
      setEditing(null)
    } else if (editing !== null) {
      saveProducts(products.map((p) => (p.id === editing.id ? draftToProduct(draft, p) : p)))
      show('Producto actualizado')
      setEditing(null)
    }
  }

  const remove = (p: Product) => {
    saveProducts(products.filter((x) => x.id !== p.id))
    show(`«${p.name}» eliminado`)
    if (editing && editing !== 'new' && editing.id === p.id) setEditing(null)
  }

  const field = (key: keyof ProductDraft, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="mb-1.5 block text-sm text-tinta-900" htmlFor={`prod-${key}`}>
        {label}
      </label>
      <input
        id={`prod-${key}`}
        value={String(draft[key] ?? '')}
        onChange={(e) => setField(key, e.target.value as never)}
        className={cx(
          'w-full rounded-xl border bg-marfil-50 px-3.5 py-2.5 text-sm focus:outline-none',
          errors[key] ? 'border-rosa-400' : 'border-beige-300 focus:border-oro-400',
        )}
        {...props}
      />
      {errors[key] && <p className="mt-1 text-xs text-rosa-400">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Lista */}
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta-700"
            />
            <label htmlFor="admin-buscar-productos" className="sr-only">
              Buscar producto
            </label>
            <input
              id="admin-buscar-productos"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar producto…"
              className="w-full rounded-full border border-beige-300 bg-marfil-50 py-2.5 pl-10 pr-4 text-sm focus:border-oro-400 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-full bg-tinta-900 px-4 py-2.5 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Nuevo
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-beige-200 bg-marfil-50 px-4 py-10 text-center text-sm text-tinta-700">
            No hay productos que coincidan.
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((p) => (
              <li
                key={p.id}
                className={cx(
                  'flex items-center gap-3 rounded-2xl border bg-marfil-50 px-4 py-3',
                  editing && editing !== 'new' && editing.id === p.id
                    ? 'border-oro-400'
                    : 'border-beige-200',
                )}
              >
                <img
                  src={p.image}
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-10 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-tinta-900">{p.name}</p>
                  <p className="text-xs text-tinta-700">
                    {formatPrice(p.price)} · stock {p.stock}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  aria-label={`Editar ${p.name}`}
                  className="rounded-full p-2 text-tinta-700 hover:bg-beige-100 hover:text-tinta-900"
                >
                  <Pencil aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  aria-label={`Eliminar ${p.name}`}
                  className="rounded-full p-2 text-tinta-700 hover:bg-rosa-100 hover:text-rosa-400"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs leading-relaxed text-tinta-700">
          {filtered.length} de {products.length} productos. Los cambios se guardan en este
          navegador (localStorage).
        </p>
      </div>

      {/* Formulario */}
      <div className="lg:col-span-3">
        {!editing ? (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-beige-300 bg-marfil-50 px-6 py-12 text-center">
            <Pencil aria-hidden="true" className="mb-3 h-6 w-6 text-oro-400" />
            <p className="text-sm font-light text-tinta-700">
              Selecciona un producto para editarlo o pulsa «Nuevo» para crear uno.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              save()
            }}
            noValidate
            className="rounded-2xl border border-beige-200 bg-marfil-50 p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl text-tinta-900">
                {editing === 'new' ? 'Nuevo producto' : `Editar: ${editing.name}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Cerrar formulario"
                className="rounded-full p-2 text-tinta-700 hover:bg-beige-100"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {field('name', 'Nombre *')}
              {field('slug', 'Slug (URL) *')}
              <div>
                <label htmlFor="prod-category" className="mb-1.5 block text-sm text-tinta-900">
                  Categoría *
                </label>
                <select
                  id="prod-category"
                  value={draft.categoryId}
                  onChange={(e) => setField('categoryId', e.target.value)}
                  className={cx(
                    'w-full rounded-xl border bg-marfil-50 px-3.5 py-2.5 text-sm focus:outline-none',
                    errors.categoryId ? 'border-rosa-400' : 'border-beige-300 focus:border-oro-400',
                  )}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-xs text-rosa-400">{errors.categoryId}</p>}
              </div>
              {field('badge', 'Insignia (opcional)')}
              {field('price', 'Precio (€) *', { type: 'number', min: '0', step: '0.01' })}
              {field('stock', 'Stock *', { type: 'number', min: '0', step: '1' })}
              {field('image', 'Ruta de imagen *')}
              {field('ingredients', 'Ingredientes (separados por coma)')}
            </div>

            <div className="mt-4">
              <label htmlFor="prod-shortDescription" className="mb-1.5 block text-sm text-tinta-900">
                Descripción corta *
              </label>
              <textarea
                id="prod-shortDescription"
                rows={2}
                value={draft.shortDescription}
                onChange={(e) => setField('shortDescription', e.target.value)}
                className={cx(
                  'w-full rounded-xl border bg-marfil-50 px-3.5 py-2.5 text-sm focus:outline-none',
                  errors.shortDescription ? 'border-rosa-400' : 'border-beige-300 focus:border-oro-400',
                )}
              />
              {errors.shortDescription && (
                <p className="mt-1 text-xs text-rosa-400">{errors.shortDescription}</p>
              )}
            </div>

            <div className="mt-4">
              <label htmlFor="prod-description" className="mb-1.5 block text-sm text-tinta-900">
                Descripción completa *
              </label>
              <textarea
                id="prod-description"
                rows={4}
                value={draft.description}
                onChange={(e) => setField('description', e.target.value)}
                className={cx(
                  'w-full rounded-xl border bg-marfil-50 px-3.5 py-2.5 text-sm focus:outline-none',
                  errors.description ? 'border-rosa-400' : 'border-beige-300 focus:border-oro-400',
                )}
              />
              {errors.description && <p className="mt-1 text-xs text-rosa-400">{errors.description}</p>}
            </div>

            <div className="mt-4">
              <label htmlFor="prod-usage" className="mb-1.5 block text-sm text-tinta-900">
                Modo de uso *
              </label>
              <textarea
                id="prod-usage"
                rows={2}
                value={draft.usage}
                onChange={(e) => setField('usage', e.target.value)}
                className={cx(
                  'w-full rounded-xl border bg-marfil-50 px-3.5 py-2.5 text-sm focus:outline-none',
                  errors.usage ? 'border-rosa-400' : 'border-beige-300 focus:border-oro-400',
                )}
              />
              {errors.usage && <p className="mt-1 text-xs text-rosa-400">{errors.usage}</p>}
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-tinta-900">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setField('featured', e.target.checked)}
                className="h-4 w-4 accent-salvia-600"
              />
              Destacado en la portada
            </label>

            {preview && (
              <div className="mt-6 rounded-2xl border border-oro-300 bg-marfil-100 p-5">
                <p className="mb-3 text-xs uppercase tracking-wide text-oro-500">Previsualización</p>
                <div className="flex gap-4">
                  <img src={draft.image} alt="" className="h-28 w-24 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="font-display text-lg text-tinta-900">
                      {draft.name || '(sin nombre)'}
                      {draft.badge && (
                        <span className="ml-2 rounded-full bg-rosa-300 px-2 py-0.5 text-[10px] uppercase text-tinta-900">
                          {draft.badge}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-tinta-700">{draft.shortDescription}</p>
                    <p className="mt-1 font-display text-lg text-tinta-900">
                      {draft.price ? formatPrice(Number(draft.price)) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
              >
                <Check aria-hidden="true" className="h-4 w-4" />
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setPreview((p) => !p)}
                aria-pressed={preview}
                className="inline-flex items-center gap-2 rounded-full border border-beige-300 px-5 py-3 text-sm text-tinta-700 transition-colors hover:border-oro-400"
              >
                <Eye aria-hidden="true" className="h-4 w-4" />
                {preview ? 'Ocultar previsualización' : 'Previsualizar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

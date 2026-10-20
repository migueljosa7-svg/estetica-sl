/** CRUD de categorías del panel de administración (demo, localStorage). */
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import { cx } from '@/lib/format'
import { newId } from '@/lib/adminForms'
import type { Category } from '@/lib/types'

export function AdminCategoriesTab() {
  const { categories, products, saveCategories } = useStore()
  const { show } = useToast()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('El nombre necesita al menos 2 caracteres.')
      return
    }
    const id = newId('cat')
    const slug = name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const category: Category = {
      id,
      name: name.trim(),
      slug,
      description: description.trim() || 'Categoría creada desde el panel de la demo.',
    }
    saveCategories([...categories, category])
    setName('')
    setDescription('')
    setError('')
    show('Categoría creada')
  }

  const remove = (c: Category) => {
    const used = products.filter((p) => p.categoryId === c.id).length
    if (used > 0) {
      show(`No se puede eliminar: ${used} producto(s) usan esta categoría`)
      return
    }
    saveCategories(categories.filter((x) => x.id !== c.id))
    show('Categoría eliminada')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h2 className="mb-4 font-display text-xl text-tinta-900">Categorías actuales</h2>
        <ul className="space-y-2">
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length
            return (
              <li
                key={c.id}
                className="flex items-center gap-4 rounded-2xl border border-beige-200 bg-marfil-50 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-tinta-900">{c.name}</p>
                  <p className="text-xs text-tinta-700">/{c.slug} · {count} producto(s)</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(c)}
                  aria-label={`Eliminar categoría ${c.name}`}
                  className="rounded-full p-2 text-tinta-700 transition-colors hover:bg-rosa-100 hover:text-rosa-400"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-tinta-700">
          Las categorías con productos asignados no se pueden eliminar para no dejar huérfanos.
        </p>
      </div>

      <form
        onSubmit={addCategory}
        noValidate
        className="rounded-2xl border border-beige-200 bg-marfil-50 p-6 lg:col-span-2"
      >
        <h2 className="font-display text-xl text-tinta-900">Nueva categoría</h2>
        <label htmlFor="cat-name" className="mb-1.5 mt-4 block text-sm text-tinta-900">
          Nombre *
        </label>
        <input
          id="cat-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          className={cx(
            'w-full rounded-xl border bg-marfil-50 px-3.5 py-2.5 text-sm focus:outline-none',
            error ? 'border-rosa-400' : 'border-beige-300 focus:border-oro-400',
          )}
        />
        {error && <p className="mt-1 text-xs text-rosa-400">{error}</p>}

        <label htmlFor="cat-description" className="mb-1.5 mt-4 block text-sm text-tinta-900">
          Descripción
        </label>
        <textarea
          id="cat-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-beige-300 bg-marfil-50 px-3.5 py-2.5 text-sm focus:border-oro-400 focus:outline-none"
        />

        <button
          type="submit"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Crear categoría
        </button>
      </form>
    </div>
  )
}

/** CRUD de tratamientos del panel de administración (demo, localStorage). */
import { useMemo, useState } from 'react'
import { Check, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import { cx, formatPrice } from '@/lib/format'
import {
  draftToTreatment,
  newId,
  treatmentToDraft,
  validateTreatmentDraft,
  type TreatmentDraft,
} from '@/lib/adminForms'
import type { Treatment } from '@/lib/types'

const EMPTY: TreatmentDraft = {
  name: '',
  slug: '',
  area: 'facial',
  price: '',
  duration: '60',
  summary: '',
  description: '',
  benefits: '',
  image: '/images/t-facial-1.jpg',
  featured: false,
}

export function AdminTreatmentsTab() {
  const { treatments, saveTreatments } = useStore()
  const { show } = useToast()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Treatment | 'new' | null>(null)
  const [draft, setDraft] = useState<TreatmentDraft>(EMPTY)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return treatments
    return treatments.filter((t) => t.name.toLowerCase().includes(q))
  }, [treatments, query])

  const setField = <K extends keyof TreatmentDraft>(key: K, value: TreatmentDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: '' } : e))
  }

  const startEdit = (t: Treatment) => {
    setEditing(t)
    setDraft(treatmentToDraft(t))
    setErrors({})
  }

  const startNew = () => {
    setEditing('new')
    setDraft({ ...EMPTY, slug: `trat-${Date.now().toString(36)}` })
    setErrors({})
  }

  const save = () => {
    const found = validateTreatmentDraft(draft)
    setErrors(found)
    if (Object.keys(found).some((k) => found[k])) return

    if (editing === 'new') {
      const base: Treatment = {
        id: newId('trat'),
        slug: draft.slug.trim(),
        name: draft.name.trim(),
        area: draft.area,
        price: Number(draft.price),
        duration: Number(draft.duration),
        summary: draft.summary.trim(),
        description: draft.description.trim(),
        benefits: [],
        image: draft.image.trim(),
        featured: draft.featured,
      }
      saveTreatments([...treatments, draftToTreatment(draft, base)])
      show('Tratamiento creado')
      setEditing(null)
    } else if (editing !== null) {
      saveTreatments(
        treatments.map((t) => (t.id === editing.id ? draftToTreatment(draft, t) : t)),
      )
      show('Tratamiento actualizado')
      setEditing(null)
    }
  }

  const remove = (t: Treatment) => {
    saveTreatments(treatments.filter((x) => x.id !== t.id))
    show(`«${t.name}» eliminado`)
    if (editing && editing !== 'new' && editing.id === t.id) setEditing(null)
  }

  const inputClass = (key: keyof TreatmentDraft) =>
    cx(
      'w-full rounded-xl border bg-marfil-50 px-3.5 py-2.5 text-sm focus:outline-none',
      errors[key] ? 'border-rosa-400' : 'border-beige-300 focus:border-oro-400',
    )

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tinta-700"
            />
            <label htmlFor="admin-buscar-tratamientos" className="sr-only">
              Buscar tratamiento
            </label>
            <input
              id="admin-buscar-tratamientos"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar tratamiento…"
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
            No hay tratamientos que coincidan.
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((t) => (
              <li
                key={t.id}
                className={cx(
                  'flex items-center gap-3 rounded-2xl border bg-marfil-50 px-4 py-3',
                  editing && editing !== 'new' && editing.id === t.id
                    ? 'border-oro-400'
                    : 'border-beige-200',
                )}
              >
                <span className="rounded-full bg-salvia-100 px-2.5 py-1 text-[10px] uppercase text-salvia-600">
                  {t.area}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-tinta-900">{t.name}</p>
                  <p className="text-xs text-tinta-700">
                    {formatPrice(t.price)} · {t.duration} min
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  aria-label={`Editar ${t.name}`}
                  className="rounded-full p-2 text-tinta-700 hover:bg-beige-100"
                >
                  <Pencil aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(t)}
                  aria-label={`Eliminar ${t.name}`}
                  className="rounded-full p-2 text-tinta-700 hover:bg-rosa-100 hover:text-rosa-400"
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lg:col-span-3">
        {!editing ? (
          <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-beige-300 bg-marfil-50 px-6 py-12 text-center">
            <Pencil aria-hidden="true" className="mb-3 h-6 w-6 text-oro-400" />
            <p className="text-sm font-light text-tinta-700">
              Selecciona un tratamiento para editarlo o pulsa «Nuevo».
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
                {editing === 'new' ? 'Nuevo tratamiento' : `Editar: ${editing.name}`}
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
              <div>
                <label htmlFor="trat-name" className="mb-1.5 block text-sm text-tinta-900">
                  Nombre *
                </label>
                <input
                  id="trat-name"
                  value={draft.name}
                  onChange={(e) => setField('name', e.target.value)}
                  className={inputClass('name')}
                />
                {errors.name && <p className="mt-1 text-xs text-rosa-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="trat-slug" className="mb-1.5 block text-sm text-tinta-900">
                  Slug *
                </label>
                <input
                  id="trat-slug"
                  value={draft.slug}
                  onChange={(e) => setField('slug', e.target.value)}
                  className={inputClass('slug')}
                />
                {errors.slug && <p className="mt-1 text-xs text-rosa-400">{errors.slug}</p>}
              </div>
              <div>
                <label htmlFor="trat-area" className="mb-1.5 block text-sm text-tinta-900">
                  Zona *
                </label>
                <select
                  id="trat-area"
                  value={draft.area}
                  onChange={(e) => setField('area', e.target.value as 'facial' | 'corporal')}
                  className={inputClass('area')}
                >
                  <option value="facial">Facial</option>
                  <option value="corporal">Corporal</option>
                </select>
              </div>
              <div>
                <label htmlFor="trat-image" className="mb-1.5 block text-sm text-tinta-900">
                  Imagen *
                </label>
                <input
                  id="trat-image"
                  value={draft.image}
                  onChange={(e) => setField('image', e.target.value)}
                  className={inputClass('image')}
                />
                {errors.image && <p className="mt-1 text-xs text-rosa-400">{errors.image}</p>}
              </div>
              <div>
                <label htmlFor="trat-price" className="mb-1.5 block text-sm text-tinta-900">
                  Precio (€) *
                </label>
                <input
                  id="trat-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.price}
                  onChange={(e) => setField('price', e.target.value)}
                  className={inputClass('price')}
                />
                {errors.price && <p className="mt-1 text-xs text-rosa-400">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="trat-duration" className="mb-1.5 block text-sm text-tinta-900">
                  Duración (min) *
                </label>
                <input
                  id="trat-duration"
                  type="number"
                  min="1"
                  step="1"
                  value={draft.duration}
                  onChange={(e) => setField('duration', e.target.value)}
                  className={inputClass('duration')}
                />
                {errors.duration && <p className="mt-1 text-xs text-rosa-400">{errors.duration}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="trat-summary" className="mb-1.5 block text-sm text-tinta-900">
                Resumen *
              </label>
              <textarea
                id="trat-summary"
                rows={2}
                value={draft.summary}
                onChange={(e) => setField('summary', e.target.value)}
                className={inputClass('summary')}
              />
              {errors.summary && <p className="mt-1 text-xs text-rosa-400">{errors.summary}</p>}
            </div>

            <div className="mt-4">
              <label htmlFor="trat-description" className="mb-1.5 block text-sm text-tinta-900">
                Descripción *
              </label>
              <textarea
                id="trat-description"
                rows={4}
                value={draft.description}
                onChange={(e) => setField('description', e.target.value)}
                className={inputClass('description')}
              />
              {errors.description && <p className="mt-1 text-xs text-rosa-400">{errors.description}</p>}
            </div>

            <div className="mt-4">
              <label htmlFor="trat-benefits" className="mb-1.5 block text-sm text-tinta-900">
                Beneficios (separados por coma)
              </label>
              <input
                id="trat-benefits"
                value={draft.benefits}
                onChange={(e) => setField('benefits', e.target.value)}
                className={inputClass('benefits')}
              />
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

            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
            >
              <Check aria-hidden="true" className="h-4 w-4" />
              Guardar
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

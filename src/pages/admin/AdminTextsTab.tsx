/** Edición de textos del sitio (hero, sobre nosotros, contacto...). */
import { useState } from 'react'
import { Check } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import type { SiteTexts } from '@/lib/types'

const FIELDS: Array<{ key: keyof SiteTexts; label: string; multiline?: boolean }> = [
  { key: 'brand', label: 'Marca' },
  { key: 'tagline', label: 'Lema' },
  { key: 'heroTitle', label: 'Título principal (hero)' },
  { key: 'heroHighlight', label: 'Palabra destacada (hero)' },
  { key: 'heroSubtitle', label: 'Subtítulo (hero)', multiline: true },
  { key: 'aboutTitle', label: 'Título «Sobre nosotros»' },
  { key: 'aboutText', label: 'Texto «Sobre nosotros»', multiline: true },
  { key: 'contactEmail', label: 'Correo de contacto (ficticio)' },
  { key: 'contactPhone', label: 'Teléfono de contacto (ficticio)' },
  { key: 'contactAddress', label: 'Dirección (ficticia)' },
  { key: 'contactHours', label: 'Horario' },
  { key: 'demoNotice', label: 'Aviso de demostración', multiline: true },
]

export function AdminTextsTab() {
  const { texts, saveTexts } = useStore()
  const { show } = useToast()
  const [draft, setDraft] = useState<SiteTexts>(texts)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const found: Record<string, string> = {}
    if (draft.brand.trim().length < 2) found.brand = 'La marca es obligatoria.'
    if (draft.heroTitle.trim().length < 2) found.heroTitle = 'El título es obligatorio.'
    if (draft.heroSubtitle.trim().length < 10) {
      found.heroSubtitle = 'El subtítulo necesita al menos 10 caracteres.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.contactEmail.trim())) {
      found.contactEmail = 'Correo no válido.'
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return
    saveTexts({ ...draft })
    show('Textos actualizados')
  }

  return (
    <form
      onSubmit={save}
      noValidate
      className="mx-auto max-w-3xl rounded-2xl border border-beige-200 bg-marfil-50 p-6"
    >
      <h2 className="font-display text-xl text-tinta-900">Textos del sitio</h2>
      <p className="mt-1 text-sm text-tinta-700">
        Se aplican al instante a la portada, el pie y la página de contacto.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, label, multiline }) => (
          <div key={key} className={multiline ? 'sm:col-span-2' : ''}>
            <label htmlFor={`txt-${key}`} className="mb-1.5 block text-sm text-tinta-900">
              {label}
            </label>
            {multiline ? (
              <textarea
                id={`txt-${key}`}
                rows={3}
                value={draft[key]}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                className="w-full rounded-xl border border-beige-300 bg-marfil-100 px-3.5 py-2.5 text-sm focus:border-oro-400 focus:outline-none"
              />
            ) : (
              <input
                id={`txt-${key}`}
                value={draft[key]}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                className="w-full rounded-xl border border-beige-300 bg-marfil-100 px-3.5 py-2.5 text-sm focus:border-oro-400 focus:outline-none"
              />
            )}
            {errors[key] && <p className="mt-1 text-xs text-rosa-400">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
      >
        <Check aria-hidden="true" className="h-4 w-4" />
        Guardar textos
      </button>
    </form>
  )
}

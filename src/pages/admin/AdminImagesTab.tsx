/**
 * Gestión de imágenes del sitio: hero, «sobre nosotros» y slides del carrusel.
 * AVISO: si añades URLs externas, respeta sus licencias. Las imágenes que ya
 * incluye la demo están registradas en src/data/image-licenses.json.
 */
import { useState } from 'react'
import { Check } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import { newId } from '@/lib/adminForms'
import type { CarouselSlide, SiteTexts } from '@/lib/types'

const PRESETS = [
  '/images/hero.jpg',
  '/images/about.jpg',
  '/images/slide-1.jpg',
  '/images/slide-2.jpg',
  '/images/slide-3.jpg',
  '/images/slide-4.jpg',
  '/images/t-facial-1.jpg',
  '/images/t-facial-2.jpg',
  '/images/t-facial-3.jpg',
  '/images/t-corp-1.jpg',
  '/images/t-corp-2.jpg',
  '/images/t-corp-3.jpg',
  '/images/t-corp-4.jpg',
  ...[
    'serum-luminar',
    'crema-nube-avena',
    'mascarilla-arcilla',
    'contorno-aurora',
    'aceite-seda',
    'exfoliante-melocoton',
    'lotion-salvia',
    'rubor-petalo',
    'balsamo-rosa-vieja',
    'base-segunda-piel',
    'parfum-jardin',
    'bruma-vela-sal',
  ].map((n) => `/images/products/${n}.svg`),
]

export function AdminImagesTab() {
  const { texts, slides, saveTexts, saveSlides } = useStore()
  const { show } = useToast()
  const [heroDraft, setHeroDraft] = useState<SiteTexts>({ ...texts })
  const [slideList, setSlideList] = useState<CarouselSlide[]>([...slides])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')

  const saveHero = (e: React.FormEvent) => {
    e.preventDefault()
    const found: Record<string, string> = {}
    if (!heroDraft.heroImage.trim()) found.heroImage = 'Indica una ruta de imagen.'
    if (!heroDraft.heroAlt.trim()) found.heroAlt = 'El texto alternativo es obligatorio (accesibilidad).'
    if (!heroDraft.aboutImage.trim()) found.aboutImage = 'Indica una ruta de imagen.'
    if (!heroDraft.aboutAlt.trim()) found.aboutAlt = 'El texto alternativo es obligatorio (accesibilidad).'
    setErrors(found)
    setNotice(
      found.heroImage || found.heroAlt || found.aboutImage || found.aboutAlt
        ? ''
        : 'Recuerda respetar la licencia de cualquier imagen externa que añadas.',
    )
    if (Object.keys(found).length > 0) return
    saveTexts({ ...heroDraft })
    show('Imágenes de portada actualizadas')
  }

  const updateSlide = (id: string, patch: Partial<CarouselSlide>) => {
    setSlideList((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const addSlide = () => {
    setSlideList((list) => [
      ...list,
      { id: newId('slide'), image: '/images/slide-1.jpg', alt: '', title: '', subtitle: '' },
    ])
  }

  const removeSlide = (id: string) => {
    setSlideList((list) => list.filter((s) => s.id !== id))
  }

  const saveSlidesAll = () => {
    const incomplete = slideList.some((s) => !s.image.trim() || !s.alt.trim() || !s.title.trim())
    if (incomplete) {
      setErrors({ slides: 'Cada slide necesita imagen, texto alternativo y título.' })
      return
    }
    setErrors({})
    saveSlides([...slideList])
    show('Carrusel actualizado')
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={saveHero}
        noValidate
        className="rounded-2xl border border-beige-200 bg-marfil-50 p-6"
      >
        <h2 className="font-display text-xl text-tinta-900">Hero y «Sobre nosotros»</h2>
        {notice && <p className="mt-2 text-xs text-oro-500">{notice}</p>}

        <Preview label="Vista previa del hero" src={heroDraft.heroImage} alt={heroDraft.heroAlt} />

        <ImgField
          id="heroImage"
          label="Imagen del hero *"
          value={heroDraft.heroImage}
          error={errors.heroImage}
          onChange={(v) => setHeroDraft((d) => ({ ...d, heroImage: v }))}
        />
        <ImgField
          id="heroAlt"
          label="Texto alternativo del hero *"
          value={heroDraft.heroAlt}
          error={errors.heroAlt}
          onChange={(v) => setHeroDraft((d) => ({ ...d, heroAlt: v }))}
        />

        <Preview label="Vista previa «Sobre nosotros»" src={heroDraft.aboutImage} alt={heroDraft.aboutAlt} />

        <ImgField
          id="aboutImage"
          label="Imagen «Sobre nosotros» *"
          value={heroDraft.aboutImage}
          error={errors.aboutImage}
          onChange={(v) => setHeroDraft((d) => ({ ...d, aboutImage: v }))}
        />
        <ImgField
          id="aboutAlt"
          label="Texto alternativo «Sobre nosotros» *"
          value={heroDraft.aboutAlt}
          error={errors.aboutAlt}
          onChange={(v) => setHeroDraft((d) => ({ ...d, aboutAlt: v }))}
        />

        <button
          type="submit"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
        >
          <Check aria-hidden="true" className="h-4 w-4" />
          Guardar imágenes
        </button>
      </form>

      <div className="rounded-2xl border border-beige-200 bg-marfil-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-tinta-900">Slides del carrusel</h2>
          <button
            type="button"
            onClick={addSlide}
            className="rounded-full border border-beige-300 px-4 py-2 text-sm text-tinta-700 transition-colors hover:border-oro-400"
          >
            + Añadir slide
          </button>
        </div>
        {errors.slides && <p className="mb-3 text-xs text-rosa-400">{errors.slides}</p>}
        <ul className="space-y-4">
          {slideList.map((s, i) => (
            <li key={s.id} className="rounded-xl border border-beige-200 bg-marfil-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-tinta-900">Slide {i + 1}</p>
                <button
                  type="button"
                  onClick={() => removeSlide(s.id)}
                  className="text-xs text-tinta-700 hover:text-rosa-400 hover:underline"
                >
                  Eliminar
                </button>
              </div>
              <Preview small label={`Vista previa — slide ${i + 1}`} src={s.image} alt={s.alt} />
              <ImgField
                id={`slide-image-${s.id}`}
                label="Imagen *"
                value={s.image}
                onChange={(v) => updateSlide(s.id, { image: v })}
              />
              <div className="mt-3">
                <label htmlFor={`slide-alt-${s.id}`} className="mb-1.5 block text-sm text-tinta-900">
                  Texto alternativo *
                </label>
                <input
                  id={`slide-alt-${s.id}`}
                  value={s.alt}
                  onChange={(e) => updateSlide(s.id, { alt: e.target.value })}
                  className="w-full rounded-xl border border-beige-300 bg-marfil-50 px-3.5 py-2.5 text-sm focus:border-oro-400 focus:outline-none"
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`slide-title-${s.id}`} className="mb-1.5 block text-sm text-tinta-900">
                    Título *
                  </label>
                  <input
                    id={`slide-title-${s.id}`}
                    value={s.title}
                    onChange={(e) => updateSlide(s.id, { title: e.target.value })}
                    className="w-full rounded-xl border border-beige-300 bg-marfil-50 px-3.5 py-2.5 text-sm focus:border-oro-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor={`slide-sub-${s.id}`} className="mb-1.5 block text-sm text-tinta-900">
                    Subtítulo
                  </label>
                  <input
                    id={`slide-sub-${s.id}`}
                    value={s.subtitle}
                    onChange={(e) => updateSlide(s.id, { subtitle: e.target.value })}
                    className="w-full rounded-xl border border-beige-300 bg-marfil-50 px-3.5 py-2.5 text-sm focus:border-oro-400 focus:outline-none"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={saveSlidesAll}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
        >
          <Check aria-hidden="true" className="h-4 w-4" />
          Guardar carrusel
        </button>
      </div>
    </div>
  )
}

function Preview({
  label,
  src,
  alt,
  small,
}: {
  label: string
  src: string
  alt: string
  small?: boolean
}) {
  return (
    <div className={small ? 'mb-3' : 'mt-4'}>
      <p className="mb-2 text-xs uppercase tracking-wide text-oro-500">{label}</p>
      <div
        className={`overflow-hidden rounded-xl border border-beige-200 bg-beige-100 ${small ? 'max-h-28' : 'max-h-48'}`}
      >
        <img src={src} alt={alt || label} className="h-full w-full object-cover" />
      </div>
    </div>
  )
}

function ImgField({
  id,
  label,
  value,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  error?: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mt-3">
      <label htmlFor={id} className="mb-1.5 block text-sm text-tinta-900">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-beige-300 bg-marfil-100 px-3.5 py-2.5 text-sm focus:border-oro-400 focus:outline-none"
        />
        <select
          aria-label={`${label} — elegir de la biblioteca`}
          value={PRESETS.includes(value) ? value : ''}
          onChange={(e) => {
            if (e.target.value) onChange(e.target.value)
          }}
          className="max-w-32 rounded-xl border border-beige-300 bg-marfil-100 px-2 text-xs text-tinta-700 focus:border-oro-400 focus:outline-none"
        >
          <option value="">Galería…</option>
          {PRESETS.map((p) => (
            <option key={p} value={p}>
              {p.split('/').pop()}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-rosa-400">{error}</p>}
    </div>
  )
}


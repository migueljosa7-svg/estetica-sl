/** Tratamientos faciales y corporales con filtro por zona y acordeón de detalles. */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Clock, Sparkles } from 'lucide-react'
import { LazyImage } from '@/components/LazyImage'
import { Reveal } from '@/components/Reveal'
import { useStore } from '@/context/StoreContext'
import { cx, formatPrice } from '@/lib/format'
import { WhatsAppButton } from '@/components/WhatsApp'
import type { TreatmentArea } from '@/lib/types'

type AreaFilter = TreatmentArea | 'all'

const AREA_LABELS: Array<{ value: AreaFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'facial', label: 'Facial' },
  { value: 'corporal', label: 'Corporal' },
]

export function TreatmentsPage() {
  const { treatments, texts } = useStore()
  const [area, setArea] = useState<AreaFilter>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(
    () => (area === 'all' ? treatments : treatments.filter((t) => t.area === area)),
    [treatments, area],
  )

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-oro-500">
          Carta de servicios (demo)
        </p>
        <h1 className="text-balance-site text-4xl font-light text-tinta-900 sm:text-5xl">
          Tratamientos faciales y corporales
        </h1>
        <p className="mt-4 text-base font-light leading-relaxed text-tinta-700">
          Precios, duraciones y descripciones son ficticios, creados para esta demostración.
          Las reservas no son reales: úsalos como referencia del tipo de carta que ofrecería
          un centro de estética.
        </p>
      </header>

      <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar por zona">
        {AREA_LABELS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => setArea(a.value)}
            aria-pressed={area === a.value}
            className={cx(
              'rounded-full px-5 py-2.5 text-sm transition-colors',
              area === a.value
                ? 'bg-tinta-900 text-marfil-50'
                : 'border border-beige-300 bg-marfil-50 text-tinta-700 hover:border-oro-400',
            )}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t, i) => {
          const open = openId === t.id
          return (
            <Reveal key={t.id} delay={Math.min(i * 0.07, 0.4)}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-beige-200 bg-marfil-50 transition-all hover:border-oro-300 hover:shadow-[0_16px_48px_-16px_rgba(74,66,56,0.25)]">
                <div className="relative">
                  <LazyImage
                    src={t.image}
                    alt={t.name}
                    className="aspect-[16/10] w-full"
                    imgClassName="transition-transform duration-500 hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-marfil-50/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-tinta-900 backdrop-blur">
                    {t.area === 'facial' ? 'Facial' : 'Corporal'}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-xl font-light text-tinta-900">{t.name}</h2>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tinta-700">
                    <span className="inline-flex items-center gap-1">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5 text-oro-500" />
                      {t.duration} min
                    </span>
                    <span className="font-display text-base text-tinta-900">
                      {formatPrice(t.price)}
                    </span>
                  </p>
                  <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-tinta-700">
                    {t.summary}
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : t.id)}
                    aria-expanded={open}
                    aria-controls={`trat-detalle-${t.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-sm text-salvia-600 transition-colors hover:text-oro-500"
                  >
                    {open ? 'Ocultar detalles' : 'Ver detalles'}
                    <span aria-hidden="true">{open ? '↑' : '↓'}</span>
                  </button>

                  <div
                    id={`trat-detalle-${t.id}`}
                    className={cx(
                      'grid transition-all duration-300',
                      open ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="rounded-xl bg-marfil-100 p-4 text-sm font-light leading-relaxed text-tinta-700">
                        <p>{t.description}</p>
                        <p className="mt-3 text-xs text-oro-500">{t.sessions}</p>
                        <ul className="mt-3 grid gap-1.5">
                          {t.benefits.map((b) => (
                            <li key={b} className="flex items-start gap-2">
                              <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-salvia-600" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/contacto"
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-tinta-900 px-5 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
                  >
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                    Solicitar cita (demo)
                  </Link>

                  <WhatsAppButton
                    phone={texts.contactPhone}
                    variant="compact"
                    target={{ type: 'treatment', id: t.id, name: t.name }}
                    value={String(t.price)}
                    className="mt-3"
                  />
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mt-14">
        <div className="rounded-3xl border border-rosa-200 bg-rosa-100 px-8 py-10 text-center">
          <h2 className="font-display text-2xl font-light text-tinta-900">
            ¿No sabes cuál elegir?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed text-tinta-700">
            En el centro real haríamos un diagnóstico gratuito de tu piel o de tus objetivos
            corporales antes de empezar. En esta demo, escríbenos y te orientamos igual.
          </p>
          <Link
            to="/contacto"
            className="mt-6 inline-block rounded-full bg-tinta-900 px-8 py-3.5 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
          >
            Pedir orientación
          </Link>
        </div>
      </Reveal>
    </div>
  )
}

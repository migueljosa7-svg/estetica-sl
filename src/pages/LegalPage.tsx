/** Páginas legales de ejemplo (privacidad, cookies, condiciones, devoluciones, aviso). */
import { Link, useParams } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import legal from '@/data/legal.json'
import { NotFoundPage } from './NotFoundPage'

const SECTION_LINKS = [
  { key: 'privacidad', label: 'Privacidad' },
  { key: 'cookies', label: 'Cookies' },
  { key: 'condiciones', label: 'Condiciones de compra' },
  { key: 'devoluciones', label: 'Devoluciones' },
  { key: 'aviso', label: 'Aviso legal' },
] as const

type SectionKey = (typeof SECTION_LINKS)[number]['key']

function isSectionKey(value: string | undefined): value is SectionKey {
  return Boolean(value) && SECTION_LINKS.some((l) => l.key === value)
}

export function LegalPage() {
  const { section } = useParams<{ section: string }>()

  if (!isSectionKey(section)) {
    return (
      <NotFoundPage
        title="Documento no encontrado"
        description="La página legal que buscas no existe en esta demo."
      />
    )
  }

  const page = legal.pages[section]

  return (
    <div className="container-site py-12 sm:py-16">
      <nav aria-label="Documentos legales" className="mb-8 flex flex-wrap gap-2">
        {SECTION_LINKS.map((l) => (
          <Link
            key={l.key}
            to={`/legal/${l.key}`}
            className={
              l.key === section
                ? 'rounded-full bg-tinta-900 px-4 py-2 text-sm text-marfil-50'
                : 'rounded-full border border-beige-300 bg-marfil-50 px-4 py-2 text-sm text-tinta-700 transition-colors hover:border-oro-400'
            }
            aria-current={l.key === section ? 'page' : undefined}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <article className="mx-auto max-w-3xl">
        <div
          role="note"
          aria-label="Advertencia de documento demo"
          className="mb-8 flex items-start gap-3 rounded-2xl border border-rosa-300 bg-rosa-100 px-5 py-4"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-rosa-400" />
          <p className="text-sm font-light leading-relaxed text-tinta-700">
            <strong className="font-medium text-tinta-900">Documento DEMO.</strong> {legal.warning}
          </p>
        </div>

        <h1 className="text-balance-site text-3xl font-light text-tinta-900 sm:text-4xl">
          {page.title}
        </h1>
        <p className="mt-4 text-base font-light leading-relaxed text-tinta-700">{page.intro}</p>

        <div className="mt-10 space-y-8">
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl font-light text-tinta-900">{s.heading}</h2>
              <span aria-hidden="true" className="mt-2 block h-px w-10 bg-oro-400" />
              <p className="mt-3 text-sm font-light leading-relaxed text-tinta-700">{s.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-xl bg-beige-100 px-5 py-4 text-xs leading-relaxed text-tinta-700">
          Última actualización de ejemplo: octubre de 2026. Texto ficticio generado para esta
          demostración técnica; requiere revisión profesional antes de cualquier uso real.
        </p>
      </article>
    </div>
  )
}

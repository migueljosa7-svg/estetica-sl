/** Pie de página completo con enlaces legales y aviso de demo. */
import { Link } from 'react-router-dom'
import { Camera, Mail, MapPin, Phone } from 'lucide-react'
import { useStore } from '@/context/StoreContext'

const LEGAL_LINKS = [
  { to: '/legal/privacidad', label: 'Privacidad' },
  { to: '/legal/cookies', label: 'Cookies' },
  { to: '/legal/condiciones', label: 'Condiciones de compra' },
  { to: '/legal/devoluciones', label: 'Devoluciones' },
  { to: '/legal/aviso', label: 'Aviso legal' },
]

export function Footer() {
  const { texts } = useStore()

  return (
    <footer className="mt-20 border-t border-beige-200 bg-marfil-50">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg tracking-[0.18em] text-tinta-900">
            ESTÉTICA <span className="italic text-oro-500">GUION</span>
          </p>
          <p className="mt-3 text-sm font-light leading-relaxed text-tinta-700">{texts.tagline}</p>
          <p className="mt-4 rounded-lg border border-rosa-200 bg-rosa-100 px-3 py-2 text-xs leading-relaxed text-tinta-700">
            {texts.demoNotice}
          </p>
        </div>

        <nav aria-label="Enlaces del pie">
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-oro-500">Explora</h2>
          <ul className="mt-4 space-y-2 text-sm font-light text-tinta-700">
            <li><Link className="hover:text-tinta-900 hover:underline" to="/tienda">Cosmética</Link></li>
            <li><Link className="hover:text-tinta-900 hover:underline" to="/tratamientos">Tratamientos</Link></li>
            <li><Link className="hover:text-tinta-900 hover:underline" to="/favoritos">Favoritos</Link></li>
            <li><Link className="hover:text-tinta-900 hover:underline" to="/contacto">Contacto</Link></li>
          </ul>
        </nav>

        <nav aria-label="Enlaces legales">
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-oro-500">Legal</h2>
          <ul className="mt-4 space-y-2 text-sm font-light text-tinta-700">
            {LEGAL_LINKS.map((l) => (
              <li key={l.to}>
                <Link className="hover:text-tinta-900 hover:underline" to={l.to}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-oro-500">Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm font-light text-tinta-700">
            <li className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-salvia-400" />
              {texts.contactAddress}
            </li>
            <li className="flex items-center gap-2">
              <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-salvia-400" />
              <a href={`tel:${texts.contactPhone.replace(/\s/g, '')}`} className="hover:underline">
                {texts.contactPhone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-salvia-400" />
              <a href={`mailto:${texts.contactEmail}`} className="hover:underline">
                {texts.contactEmail}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Camera aria-hidden="true" className="h-4 w-4 shrink-0 text-salvia-400" />
              <span>@esteticaguion.demo</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-beige-200">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-tinta-700 sm:flex-row">
          <p>© {new Date().getFullYear()} ESTÉTICA GUION — demo ficticia sin ánimo de lucro.</p>
          <p className="flex items-center gap-4">
            <Link to="/legal/aviso" className="hover:underline">Aviso legal</Link>
            <Link to="/admin" className="hover:underline">Panel demo</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

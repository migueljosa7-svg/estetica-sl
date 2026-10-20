/** Página 404 con enlaces de vuelta. */
import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

interface NotFoundPageProps {
  title?: string
  description?: string
}

export function NotFoundPage({
  title = 'Página no encontrada',
  description = 'La dirección que buscas no existe o ha cambiado. Vuelve al inicio para seguir explorando la demo.',
}: NotFoundPageProps) {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-beige-100 text-oro-500">
        <SearchX aria-hidden="true" className="h-7 w-7" />
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-oro-500">Error 404</p>
      <h1 className="mt-3 text-balance-site text-3xl font-light text-tinta-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-tinta-700">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-tinta-900 px-7 py-3.5 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
        >
          Ir al inicio
        </Link>
        <Link
          to="/tienda"
          className="rounded-full border border-tinta-900/20 px-7 py-3.5 text-sm text-tinta-900 transition-colors hover:border-oro-400 hover:text-oro-500"
        >
          Ver la tienda
        </Link>
      </div>
    </div>
  )
}

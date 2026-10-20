/** Página de favoritos con estado vacío y aviso de persistencia local. */
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/EmptyState'
import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/Reveal'
import { useToast } from '@/components/Toast'
import { useFavorites } from '@/context/FavoritesContext'
import { useStore } from '@/context/StoreContext'

export function FavoritesPage() {
  const { ids, clear } = useFavorites()
  const { products } = useStore()
  const { show } = useToast()

  const favorites = products.filter((p) => ids.includes(p.id))

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-oro-500">
            Tu selección
          </p>
          <h1 className="text-4xl font-light text-tinta-900 sm:text-5xl">Favoritos</h1>
          <p className="mt-3 max-w-xl text-sm font-light text-tinta-700">
            Se guardan solo en este navegador (localStorage). No se sincronizan entre
            dispositivos ni usuarios.
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clear()
              show('Favoritos eliminados')
            }}
            className="rounded-full border border-beige-300 px-5 py-2.5 text-sm text-tinta-700 transition-colors hover:border-rosa-300 hover:text-rosa-400"
          >
            Vaciar favoritos
          </button>
        )}
      </header>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart aria-hidden="true" className="h-6 w-6" />}
          title="Aún no tienes favoritos"
          description="Marca el corazón de cualquier producto del catálogo y aparecerá aquí para encontrarlo rápido."
          action={
            <Link
              to="/tienda"
              className="inline-block rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
            >
              Explorar la tienda
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i * 0.06, 0.3)}>
              <ProductCard product={product} onAdded={(name) => show(`${name} añadido a la cesta`)} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

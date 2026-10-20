/** Ficha de producto: galería, ingredientes, uso, cantidad y añadir al carrito. */
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Heart, Minus, Plus, ShoppingBag, Star, Truck } from 'lucide-react'
import { LazyImage } from '@/components/LazyImage'
import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/Reveal'
import { useToast } from '@/components/Toast'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { useStore } from '@/context/StoreContext'
import { formatPrice } from '@/lib/format'
import { NotFoundPage } from './NotFoundPage'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products, categories } = useStore()
  const { add } = useCart()
  const { isFavorite, toggle } = useFavorites()
  const { show } = useToast()
  const [qty, setQty] = useState(1)

  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <NotFoundPage
        title="Producto no encontrado"
        description="El producto que buscas no existe o ha sido eliminado desde el panel de demo."
      />
    )
  }

  const category = categories.find((c) => c.id === product.categoryId)
  const out = product.stock <= 0
  const fav = isFavorite(product.id)
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="container-site py-10 sm:py-14">
      <nav aria-label="Migas de pan" className="mb-8 flex items-center gap-2 text-sm text-tinta-700">
        <Link to="/tienda" className="inline-flex items-center gap-1.5 hover:text-oro-500 hover:underline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Volver a la tienda
        </Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <span>{category.name}</span>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-beige-200">
            <LazyImage src={product.image} alt={product.name} className="aspect-[4/5] w-full" loading="eager" />
            {product.badge && !out && (
              <span className="absolute left-4 top-4 rounded-full bg-rosa-300 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-tinta-900">
                {product.badge}
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-oro-500">
            {category?.name ?? 'Cosmética'}
          </p>
          <h1 className="mt-2 text-balance-site text-3xl font-light text-tinta-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-tinta-700">
            <span className="flex items-center gap-0.5" aria-label={`Valoración ${product.rating} de 5`}>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  aria-hidden="true"
                  className={
                    s < Math.round(product.rating)
                      ? 'h-4 w-4 fill-oro-400 text-oro-400'
                      : 'h-4 w-4 text-beige-300'
                  }
                />
              ))}
            </span>
            <span>
              {product.rating.toFixed(1)} · {product.reviews} reseñas (demo)
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl text-tinta-900">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-lg text-tinta-700/60 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 text-base font-light leading-relaxed text-tinta-700">
            {product.description}
          </p>

          <p className="mt-5 text-sm" aria-live="polite">
            {out ? (
              <span className="text-rosa-400">Producto agotado en la demo.</span>
            ) : product.stock <= 5 ? (
              <span className="text-oro-500">Últimas unidades: quedan {product.stock}.</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-salvia-600">
                <Check aria-hidden="true" className="h-4 w-4" /> En stock ({product.stock} disponibles)
              </span>
            )}
          </p>

          {/* Controles de compra */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 rounded-full border border-beige-300 px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={out}
                aria-label="Reducir cantidad"
                className="rounded-full p-2 text-tinta-700 hover:text-tinta-900 disabled:opacity-40"
              >
                <Minus aria-hidden="true" className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={out || qty >= product.stock}
                aria-label="Aumentar cantidad"
                className="rounded-full p-2 text-tinta-700 hover:text-tinta-900 disabled:opacity-40"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={out}
              onClick={() => {
                if (add(product.id, qty)) {
                  show(`${qty} × ${product.name} añadido a la cesta`)
                }
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-tinta-900 px-8 py-3.5 text-sm text-marfil-50 transition-colors hover:bg-salvia-600 disabled:cursor-not-allowed disabled:bg-beige-200 disabled:text-tinta-700/60 sm:flex-none"
            >
              <ShoppingBag aria-hidden="true" className="h-4 w-4" />
              {out ? 'Agotado' : 'Añadir a la cesta'}
            </button>

            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={fav}
              aria-label={fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              className="rounded-full border border-beige-300 p-3.5 text-tinta-700 transition-colors hover:border-rosa-300 hover:text-rosa-400"
            >
              <Heart aria-hidden="true" className={fav ? 'h-5 w-5 fill-rosa-400 text-rosa-400' : 'h-5 w-5'} />
            </button>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-salvia-100 px-4 py-2.5 text-xs text-salvia-600">
            <Truck aria-hidden="true" className="h-4 w-4" />
            Envío gratis a partir de 60 € (simulado en esta demo)
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl border border-beige-200 bg-marfil-50 p-6">
              <h2 className="font-display text-lg text-tinta-900">Ingredientes clave</h2>
              <ul className="mt-3 space-y-1.5 text-sm font-light text-tinta-700">
                {product.ingredients.map((ing) => (
                  <li key={ing} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-oro-400" />
                    {ing}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-beige-200 bg-marfil-50 p-6">
              <h2 className="font-display text-lg text-tinta-900">Modo de uso</h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-tinta-700">
                {product.usage}
              </p>
            </section>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <h2 className="text-2xl font-light text-tinta-900">También te puede interesar</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onAdded={(name) => show(`${name} añadido a la cesta`)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

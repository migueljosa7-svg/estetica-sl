/** Tarjeta de producto del catálogo: favorito, precio, stock y añadir al carrito. */
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { LazyImage } from './LazyImage'
import { formatPrice } from '@/lib/format'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  /** Notificación de "añadido" controlada por la página. */
  onAdded?: (name: string) => void
}

export function ProductCard({ product, onAdded }: ProductCardProps) {
  const { add } = useCart()
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(product.id)
  const out = product.stock <= 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-beige-200 bg-marfil-50 transition-all duration-300 hover:-translate-y-1 hover:border-oro-300 hover:shadow-[0_12px_40px_-12px_rgba(74,66,56,0.25)]">
      <div className="relative">
        <Link to={`/tienda/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <LazyImage
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full"
            imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        {product.badge && !out && (
          <span className="absolute left-3 top-3 rounded-full bg-rosa-300 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-tinta-900">
            {product.badge}
          </span>
        )}
        {out && (
          <span className="absolute left-3 top-3 rounded-full bg-tinta-900/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-marfil-50">
            Agotado
          </span>
        )}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-pressed={fav}
          aria-label={fav ? `Quitar ${product.name} de favoritos` : `Añadir ${product.name} a favoritos`}
          className="absolute right-3 top-3 rounded-full bg-marfil-50/90 p-2.5 text-tinta-700 shadow-sm backdrop-blur transition-colors hover:text-rosa-400"
        >
          <Heart aria-hidden="true" className={fav ? 'h-4 w-4 fill-rosa-400 text-rosa-400' : 'h-4 w-4'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link
          to={`/tienda/${product.slug}`}
          className="font-display text-lg font-light leading-snug text-tinta-900 hover:text-oro-500"
        >
          {product.name}
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm font-light leading-relaxed text-tinta-700">
          {product.shortDescription}
        </p>

        <div className="mt-2 flex items-center gap-1 text-xs text-tinta-700">
          <Star aria-hidden="true" className="h-3.5 w-3.5 fill-oro-400 text-oro-400" />
          <span className="font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-tinta-700/70">({product.reviews} reseñas)</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl text-tinta-900">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-tinta-700/60 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={out}
            onClick={() => {
              if (add(product.id)) onAdded?.(product.name)
            }}
            aria-label={out ? `${product.name} agotado` : `Añadir ${product.name} al carrito`}
            className="inline-flex items-center gap-2 rounded-full bg-tinta-900 px-4 py-2.5 text-sm text-marfil-50 transition-all hover:bg-salvia-600 disabled:cursor-not-allowed disabled:bg-beige-200 disabled:text-tinta-700/60"
          >
            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
            {out ? 'Sin stock' : 'Añadir'}
          </button>
        </div>
      </div>
    </article>
  )
}

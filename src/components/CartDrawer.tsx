/**
 * Cajón lateral del carrito: cantidades, eliminación, subtotal,
 * envío ficticio y confirmación de compra simulada.
 */
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useStore } from '@/context/StoreContext'
import { joinWithProducts, subtotal as calcSubtotal } from '@/lib/cart'
import { formatPrice } from '@/lib/format'
import { EmptyState } from './EmptyState'
import { LazyImage } from './LazyImage'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { lines, setQty, remove, clear } = useCart()
  const { products } = useStore()
  const [confirmed, setConfirmed] = useState(false)

  const entries = useMemo(() => joinWithProducts(lines, products), [lines, products])
  const subtotal = calcSubtotal(entries)
  const shipping = subtotal > 0 && subtotal < 60 ? 4.95 : 0
  const total = subtotal + shipping

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      setConfirmed(false)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-tinta-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compra (demostración)"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-marfil-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-beige-200 px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-light text-tinta-900">Tu cesta</h2>
                <p className="text-xs text-tinta-700">Carrito de demostración · sin cobros reales</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar carrito"
                className="rounded-full p-2 text-tinta-700 transition-colors hover:bg-beige-100 hover:text-tinta-900"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {confirmed ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <CheckCircle2 aria-hidden="true" className="mb-4 h-14 w-14 text-salvia-400" />
                  <h3 className="font-display text-xl text-tinta-900">¡Pedido simulado!</h3>
                  <p className="mt-2 max-w-xs text-sm font-light leading-relaxed text-tinta-700">
                    Esta es una demostración: no se ha realizado ningún cobro ni se enviará
                    producto. Gracias por probar el carrito.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      clear()
                      onClose()
                    }}
                    className="mt-6 rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
                  >
                    Volver a la tienda
                  </button>
                </div>
              ) : entries.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag aria-hidden="true" className="h-6 w-6" />}
                  title="Tu cesta está vacía"
                  description="Descubre nuestra cosmética de autor y añade tus favoritos para verlos aquí."
                  action={
                    <Link
                      to="/tienda"
                      onClick={onClose}
                      className="inline-block rounded-full bg-tinta-900 px-6 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
                    >
                      Ir a la tienda
                    </Link>
                  }
                />
              ) : (
                <ul className="space-y-4">
                  {entries.map(({ line, product }) => (
                    <li
                      key={line.productId}
                      className="flex gap-4 rounded-2xl border border-beige-200 bg-marfil-100 p-3"
                    >
                      <LazyImage
                        src={product.image}
                        alt={product.name}
                        className="h-24 w-20 shrink-0 rounded-xl"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-medium text-tinta-900">{product.name}</p>
                          <button
                            type="button"
                            onClick={() => remove(line.productId)}
                            aria-label={`Eliminar ${product.name} del carrito`}
                            className="rounded-full p-1.5 text-tinta-700 transition-colors hover:bg-rosa-100 hover:text-rosa-400"
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-tinta-700">{formatPrice(product.price)} / ud.</p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 rounded-full border border-beige-300 px-1">
                            <button
                              type="button"
                              onClick={() => setQty(line.productId, line.qty - 1)}
                              aria-label={`Reducir cantidad de ${product.name}`}
                              className="rounded-full p-1.5 text-tinta-700 hover:text-tinta-900"
                            >
                              <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-6 text-center text-sm" aria-live="polite">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(line.productId, line.qty + 1)}
                              disabled={line.qty >= product.stock}
                              aria-label={`Aumentar cantidad de ${product.name}`}
                              className="rounded-full p-1.5 text-tinta-700 hover:text-tinta-900 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-medium text-tinta-900">
                            {formatPrice(product.price * line.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!confirmed && entries.length > 0 && (
              <footer className="border-t border-beige-200 px-6 py-5">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-tinta-700">
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-tinta-700">
                    <dt>Envío (demo)</dt>
                    <dd>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-beige-200 pt-2 text-base font-medium text-tinta-900">
                    <dt>Total</dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                </dl>
                {shipping > 0 && (
                  <p className="mt-2 rounded-lg bg-salvia-100 px-3 py-2 text-xs text-salvia-600">
                    Añade {formatPrice(60 - subtotal)} más para tener el envío gratis (simulado).
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  className="mt-4 w-full rounded-full bg-tinta-900 px-6 py-3.5 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
                >
                  Finalizar compra (demo)
                </button>
                <p className="mt-2 text-center text-[11px] leading-relaxed text-tinta-700">
                  No se solicitarán datos de pago: esto es una demostración técnica.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}


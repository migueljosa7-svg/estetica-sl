/**
 * CartContext — carrito de demostración persistido en localStorage.
 * Los datos viven SOLO en el navegador del usuario; no hay base de datos
 * compartida ni sincronización entre dispositivos.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as cartLib from '@/lib/cart'
import { STORAGE_KEYS, readStorage, writeStorage } from '@/lib/storage'
import type { CartLine } from '@/lib/types'
import { useStore } from './StoreContext'

interface CartContextValue {
  lines: CartLine[]
  /** Número total de unidades. */
  count: number
  /** Subtotal en euros. */
  subtotal: number
  shipping: number
  total: number
  add: (productId: string, qty?: number) => boolean
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useStore()
  const [lines, setLines] = useState<CartLine[]>(() =>
    readStorage<CartLine[]>(STORAGE_KEYS.cart, []),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, lines)
  }, [lines])

  const add = useCallback(
    (productId: string, qty = 1) => {
      const product = products.find((p) => p.id === productId)
      if (!product || product.stock <= 0) return false
      setLines((prev) => cartLib.addItem(prev, productId, product.stock, qty))
      return true
    },
    [products],
  )

  const setQty = useCallback(
    (productId: string, qty: number) => {
      const product = products.find((p) => p.id === productId)
      const stock = product ? product.stock : 0
      setLines((prev) => cartLib.setQuantity(prev, productId, qty, stock))
    },
    [products],
  )

  const remove = useCallback((productId: string) => {
    setLines((prev) => cartLib.removeItem(prev, productId))
  }, [])

  const clear = useCallback(() => setLines(cartLib.clearCart()), [])

  const value = useMemo<CartContextValue>(() => {
    const entries = cartLib.joinWithProducts(lines, products)
    const sub = cartLib.subtotal(entries)
    const ship = cartLib.shippingCost(sub)
    return {
      lines,
      count: cartLib.totalItems(lines),
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
      add,
      setQty,
      remove,
      clear,
    }
  }, [lines, products, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}

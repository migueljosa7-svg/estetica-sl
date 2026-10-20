/**
 * Lógica pura del carrito de demostración.
 * Se mantiene separada de React para poder testearla fácilmente.
 */
import type { CartLine, Product } from './types'

export interface CartEntry {
  line: CartLine
  product: Product
}

/** Añade (o incrementa) un producto. Respeta el stock disponible. */
export function addItem(
  lines: CartLine[],
  productId: string,
  stock: number,
  qty = 1,
): CartLine[] {
  if (qty <= 0) return lines
  const existing = lines.find((l) => l.productId === productId)
  if (existing) {
    const nextQty = Math.min(existing.qty + qty, Math.max(stock, 0))
    if (nextQty === existing.qty) return lines
    return lines.map((l) =>
      l.productId === productId ? { ...l, qty: nextQty } : l,
    )
  }
  const initial = Math.min(qty, Math.max(stock, 0))
  if (initial <= 0) return lines
  return [...lines, { productId, qty: initial }]
}

/** Cambia la cantidad; elimina la línea si queda a 0 o sin stock. */
export function setQuantity(
  lines: CartLine[],
  productId: string,
  qty: number,
  stock: number,
): CartLine[] {
  if (qty <= 0) return removeItem(lines, productId)
  const clamped = Math.min(qty, Math.max(stock, 0))
  if (clamped <= 0) return removeItem(lines, productId)
  return lines.map((l) =>
    l.productId === productId ? { ...l, qty: clamped } : l,
  )
}

export function removeItem(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((l) => l.productId !== productId)
}

export function clearCart(): CartLine[] {
  return []
}

/** Une líneas con el catálogo; descarta referencias huérfanas. */
export function joinWithProducts(
  lines: CartLine[],
  products: Product[],
): CartEntry[] {
  const byId = new Map(products.map((p) => [p.id, p]))
  const entries: CartEntry[] = []
  for (const line of lines) {
    const product = byId.get(line.productId)
    if (product) entries.push({ line, product })
  }
  return entries
}

export function subtotal(entries: CartEntry[]): number {
  return entries.reduce((sum, e) => sum + e.product.price * e.line.qty, 0)
}

export function totalItems(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0)
}

/** Gastos de envío ficticios: gratis a partir de 60 €. */
export const FREE_SHIPPING_FROM = 60
export const SHIPPING_COST = 4.95

export function shippingCost(sub: number): number {
  if (entriesIsEmpty(sub)) return 0
  return sub >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
}

function entriesIsEmpty(sub: number): boolean {
  return sub <= 0
}

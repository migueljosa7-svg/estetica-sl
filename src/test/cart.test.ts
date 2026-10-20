import { describe, expect, it } from 'vitest'
import {
  addItem,
  clearCart,
  FREE_SHIPPING_FROM,
  joinWithProducts,
  removeItem,
  setQuantity,
  SHIPPING_COST,
  shippingCost,
  subtotal,
  totalItems,
} from '@/lib/cart'
import type { CartLine, Product } from '@/lib/types'

const products: Product[] = [
  {
    id: 'a',
    slug: 'a',
    name: 'A',
    categoryId: 'c',
    price: 10,
    stock: 3,
    rating: 5,
    reviews: 1,
    image: '/i.svg',
    shortDescription: 'a',
    description: 'a larga de al menos veinte caracteres',
    ingredients: [],
    usage: 'uso',
    featured: false,
  },
  {
    id: 'b',
    slug: 'b',
    name: 'B',
    categoryId: 'c',
    price: 25,
    stock: 10,
    rating: 4,
    reviews: 2,
    image: '/i.svg',
    shortDescription: 'b',
    description: 'b larga de al menos veinte caracteres',
    ingredients: [],
    usage: 'uso',
    featured: false,
  },
]

describe('cart lib', () => {
  it('añade una línea nueva respetando el stock', () => {
    expect(addItem([], 'a', 3)).toEqual([{ productId: 'a', qty: 1 }])
    expect(addItem([], 'a', 0)).toEqual([])
    expect(addItem([], 'a', 3, 99)).toEqual([{ productId: 'a', qty: 3 }])
  })

  it('incrementa cantidades sin superar el stock', () => {
    const lines: CartLine[] = [{ productId: 'a', qty: 2 }]
    expect(addItem(lines, 'a', 3)).toEqual([{ productId: 'a', qty: 3 }])
    expect(addItem(lines, 'a', 2)).toEqual(lines) // sin cambios: tope de stock
  })

  it('setQuantity actualiza, limita y elimina a 0', () => {
    const lines: CartLine[] = [{ productId: 'a', qty: 1 }]
    expect(setQuantity(lines, 'a', 2, 3)).toEqual([{ productId: 'a', qty: 2 }])
    expect(setQuantity(lines, 'a', 99, 3)).toEqual([{ productId: 'a', qty: 3 }])
    expect(setQuantity(lines, 'a', 0, 3)).toEqual([])
  })

  it('removeItem elimina y clearCart vacía', () => {
    const lines: CartLine[] = [
      { productId: 'a', qty: 1 },
      { productId: 'b', qty: 2 },
    ]
    expect(removeItem(lines, 'a')).toEqual([{ productId: 'b', qty: 2 }])
    expect(clearCart()).toEqual([])
  })

  it('une líneas con el catálogo y calcula subtotal, unidades y envío', () => {
    const lines: CartLine[] = [
      { productId: 'a', qty: 2 },
      { productId: 'b', qty: 1 },
      { productId: 'fantasma', qty: 5 },
    ]
    const entries = joinWithProducts(lines, products)
    expect(entries).toHaveLength(2)
    expect(subtotal(entries)).toBe(45)
    expect(totalItems(lines)).toBe(8)
    expect(shippingCost(0)).toBe(0)
    expect(shippingCost(30)).toBe(SHIPPING_COST)
    expect(shippingCost(FREE_SHIPPING_FROM)).toBe(0)
    expect(shippingCost(120)).toBe(0)
  })
})


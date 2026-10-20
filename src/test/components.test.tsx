import { fireEvent, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter, Link } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@/components/Toast'
import { CartProvider } from '@/context/CartContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { StoreProvider } from '@/context/StoreContext'
import { ContactPage } from '@/pages/ContactPage'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/Button'
import { Reveal, Stagger } from '@/components/Reveal'
import type { Product } from '@/lib/types'

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <StoreProvider>
        <FavoritesProvider>
          <CartProvider>
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </FavoritesProvider>
      </StoreProvider>
    </MemoryRouter>
  )
}

const PRODUCT: Product = {
  id: 'prod-01',
  slug: 'serum-luminar',
  name: 'Sérum Luminar C15',
  categoryId: 'cat-facial',
  price: 42,
  stock: 12,
  rating: 4.8,
  reviews: 34,
  image: '/images/products/serum-luminar.svg',
  shortDescription: 'Vitamina C al 15% para un tono uniforme.',
  description: 'Descripción completa válida del producto.',
  ingredients: ['Vitamina C'],
  usage: 'Aplicar por la mañana.',
  featured: true,
}

describe('formulario de contacto', () => {
  it('muestra errores al enviar vacío y confirmación simulada al completar', async () => {
    const user = userEvent.setup()
    render(<ContactPage />, { wrapper: Providers })

    fireEvent.submit(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(await screen.findByText(/mínimo 2 caracteres/i)).toBeInTheDocument()
    expect(screen.getByText(/correo electrónico válido/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/nombre \*/i), 'Lucía Márquez')
    await user.type(screen.getByLabelText(/correo electrónico \*/i), 'lucia@example.com')
    await user.selectOptions(screen.getByLabelText(/motivo \*/i), 'Reserva de tratamiento')
    await user.type(
      screen.getByLabelText(/mensaje \*/i),
      'Me gustaría reservar un tratamiento facial la próxima semana.',
    )
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    expect(await screen.findByText(/simulado enviado/i)).toBeInTheDocument()
  })
})

describe('tarjeta de producto', () => {
  it('muestra precio, añade al carrito y marca favorito', async () => {
    const user = userEvent.setup()
    let addedName = ''
    render(
      <Providers>
        <ProductCard product={PRODUCT} onAdded={(name) => (addedName = name)} />
      </Providers>,
    )

    expect(screen.getByText(/42,00/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /añadir.*carrito/i }))
    expect(addedName).toBe('Sérum Luminar C15')

    const favButton = screen.getByRole('button', { name: /favoritos/i })
    expect(favButton).toHaveAttribute('aria-pressed', 'false')
    await user.click(favButton)
    expect(favButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('deshabilita el botón si no hay stock', () => {
    render(
      <Providers>
        <ProductCard product={{ ...PRODUCT, stock: 0 }} />
      </Providers>,
    )
    expect(screen.getByRole('button', { name: /agotado/i })).toBeDisabled()
    expect(screen.getByText(/agotado/i)).toBeInTheDocument()
  })
})

describe('animaciones de entrada', () => {
  it('Reveal renderiza el contenido y respeta la clase recibida', () => {
    render(
      <Reveal variant="fade-up" className="mi-clase" delay={0.1}>
        <p>Contenido revelado</p>
      </Reveal>,
    )
    expect(screen.getByText('Contenido revelado')).toBeInTheDocument()
    expect(screen.getByText('Contenido revelado').parentElement).toHaveClass('mi-clase')
  })

  it('Stagger renderiza todos los hijos en cascada', () => {
    render(
      <Stagger variant="zoom-in" stagger={0.05}>
        <p>Primero</p>
        <p>Segundo</p>
        <p>Tercero</p>
      </Stagger>,
    )
    expect(screen.getByText('Primero')).toBeInTheDocument()
    expect(screen.getByText('Segundo')).toBeInTheDocument()
    expect(screen.getByText('Tercero')).toBeInTheDocument()
  })
})

describe('botón', () => {
  it('renderiza como botón y dispara onClick', async () => {
    const user = userEvent.setup()
    let clicked = 0
    render(<Button onClick={() => (clicked += 1)}>Guardar</Button>)

    await user.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(clicked).toBe(1)
  })

  it('con asChild renderiza el enlace hijo conservando el texto', () => {
    render(
      <MemoryRouter>
        <Button asChild>
          <Link to="/tienda">Ir a la tienda</Link>
        </Button>
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'Ir a la tienda' })
    expect(link).toHaveAttribute('href', '/tienda')
    expect(link).toHaveClass('rounded-full')
  })
})


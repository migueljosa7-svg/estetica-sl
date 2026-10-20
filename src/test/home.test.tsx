import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@/components/Toast'
import { CartProvider } from '@/context/CartContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { StoreProvider } from '@/context/StoreContext'
import { HomePage } from '@/pages/HomePage'

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

describe('portada', () => {
  it('muestra hero, secciones destacadas y llamada a la acción', () => {
    render(<HomePage />, { wrapper: Providers })

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ver tratamientos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /descubrir cosmética/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /cosmética destacada/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /tratamientos faciales y corporales/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /resolvemos tus dudas/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contactar ahora/i })).toBeInTheDocument()
  })

  it('abre y cierra la respuesta del FAQ', async () => {
    const user = userEvent.setup()
    render(<HomePage />, { wrapper: Providers })

    const question = screen.getByRole('button', { name: /necesito cita previa/i })
    expect(question).toHaveAttribute('aria-expanded', 'false')

    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
  })
})

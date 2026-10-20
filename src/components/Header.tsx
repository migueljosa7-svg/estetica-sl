/** Cabecera responsive con navegación móvil, favoritos y carrito. */
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Phone, ShoppingBag, X, Sparkles } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { cx } from '@/lib/format'

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/tienda', label: 'Cosmética' },
  { to: '/tratamientos', label: 'Tratamientos' },
  { to: '/favoritos', label: 'Favoritos' },
  { to: '/contacto', label: 'Contacto' },
]

interface HeaderProps {
  onOpenCart: () => void
}

export function Header({ onOpenCart }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count } = useCart()
  const { ids } = useFavorites()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={cx(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-beige-200 bg-marfil-100/95 shadow-[0_2px_24px_rgba(74,66,56,0.08)] backdrop-blur'
          : 'border-b border-transparent bg-marfil-100/80 backdrop-blur',
      )}
    >
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-tinta-900 focus:px-4 focus:py-2 focus:text-marfil-100"
      >
        Saltar al contenido
      </a>

      <div className="container-site flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          to="/"
          className="group flex items-center gap-2"
          aria-label="ESTÉTICA GUION — ir al inicio"
        >
          <Sparkles aria-hidden="true" className="h-5 w-5 text-oro-400 transition-transform group-hover:rotate-12" />
          <span className="font-display text-lg font-medium tracking-[0.18em] text-tinta-900 sm:text-xl">
            ESTÉTICA <span className="italic text-oro-500">GUION</span>
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cx(
                      'rounded-full px-4 py-2 text-sm font-light tracking-wide transition-colors',
                      isActive
                        ? 'bg-salvia-100 text-salvia-600'
                        : 'text-tinta-700 hover:bg-beige-100 hover:text-tinta-900',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="tel:+34600000000"
            className="hidden items-center gap-2 rounded-full border border-beige-300 px-4 py-2 text-sm text-tinta-700 transition-colors hover:border-oro-400 hover:text-tinta-900 md:inline-flex"
          >
            <Phone aria-hidden="true" className="h-4 w-4 text-oro-500" />
            Reservar
          </a>

          <Link
            to="/favoritos"
            aria-label={`Favoritos (${ids.length})`}
            className="relative rounded-full p-2.5 text-tinta-700 transition-colors hover:bg-beige-100 hover:text-tinta-900"
          >
            <Heart aria-hidden="true" className="h-5 w-5" />
            {ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rosa-400 px-1 text-[10px] font-medium text-white">
                {ids.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Abrir carrito (${count} artículos)`}
            className="relative rounded-full p-2.5 text-tinta-700 transition-colors hover:bg-beige-100 hover:text-tinta-900"
          >
            <ShoppingBag aria-hidden="true" className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-salvia-400 px-1 text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="rounded-full p-2.5 text-tinta-700 transition-colors hover:bg-beige-100 hover:text-tinta-900 lg:hidden"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="menu-movil"
            aria-label="Navegación móvil"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-beige-200 bg-marfil-50 lg:hidden"
          >
            <ul className="container-site flex flex-col gap-1 py-4" onClick={() => setMenuOpen(false)}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cx(
                        'block rounded-xl px-4 py-3 text-base font-light transition-colors',
                        isActive
                          ? 'bg-salvia-100 text-salvia-600'
                          : 'text-tinta-800 hover:bg-beige-100',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <a
                  href="tel:+34600000000"
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-tinta-900 px-4 py-3 text-base text-marfil-100"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Llamar para reservar
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

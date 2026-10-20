/** Router de la aplicación (SPA compatible con Vercel). */
import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'

// Cada llamada a ruta se carga a demanda: bundle inicial menor y mejores
// Core Web Vitals (LCP/TTI). Vercel aplicará code-splitting automático.
const HomePageL = lazy(async () => ({ default: (await import('./pages/HomePage')).HomePage }))
const ShopPageL = lazy(async () => ({ default: (await import('./pages/ShopPage')).ShopPage }))
const ProductPageL = lazy(async () => ({ default: (await import('./pages/ProductPage')).ProductPage }))
const TreatmentsPageL = lazy(async () => ({ default: (await import('./pages/TreatmentsPage')).TreatmentsPage }))
const FavoritesPageL = lazy(async () => ({ default: (await import('./pages/FavoritesPage')).FavoritesPage }))
const ContactPageL = lazy(async () => ({ default: (await import('./pages/ContactPage')).ContactPage }))
const LegalPageL = lazy(async () => ({ default: (await import('./pages/LegalPage')).LegalPage }))
const NotFoundPageL = lazy(async () => ({ default: (await import('./pages/NotFoundPage')).NotFoundPage }))
const AdminPageL = lazy(async () => ({ default: (await import('./pages/AdminPage')).default }))

/** Restaura el scroll al cambiar de ruta. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

/** Actualiza el <title> por ruta para SEO básico. */
const TITLES: Record<string, string> = {
  '/': 'ESTÉTICA GUION — Centro de estética y cosmética premium (demo)',
  '/tienda': 'Cosmética de autor — ESTÉTICA GUION (demo)',
  '/tratamientos': 'Tratamientos faciales y corporales — ESTÉTICA GUION (demo)',
  '/favoritos': 'Tus favoritos — ESTÉTICA GUION (demo)',
  '/contacto': 'Contacto — ESTÉTICA GUION (demo)',
  '/admin': 'Panel de administración (demo) — ESTÉTICA GUION',
}

function DocumentTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title =
      TITLES[pathname] ?? 'ESTÉTICA GUION — Estética y cosmética (demo)'
  }, [pathname])
  return null
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      <DocumentTitle />
      {!isAdmin && <Header onOpenCart={() => setCartOpen(true)} />}
      <main id="contenido-principal" className={isAdmin ? '' : 'min-h-[70vh]'}>
        <Suspense
          fallback={
            <div className="container-site flex min-h-[60vh] items-center justify-center">
              <div className="skeleton h-64 w-full max-w-2xl rounded-3xl" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePageL />} />
            <Route path="/tienda" element={<ShopPageL />} />
            <Route path="/tienda/:slug" element={<ProductPageL />} />
            <Route path="/tratamientos" element={<TreatmentsPageL />} />
            <Route path="/favoritos" element={<FavoritesPageL />} />
            <Route path="/contacto" element={<ContactPageL />} />
            <Route path="/legal/:section" element={<LegalPageL />} />
            <Route path="/admin" element={<AdminPageL />} />
            <Route path="*" element={<NotFoundPageL />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

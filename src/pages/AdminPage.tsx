/**
 * Panel de administración de la DEMO.
 *
 * ADVERTENCIA DE SEGURIDAD: el acceso «admin / admin» es una barrera
 * COSMÉTICA de demostración, NO autenticación real. En producción el
 * acceso está desactivado salvo VITE_ENABLE_DEMO_ADMIN=true. No guarda
 * secretos: las credenciales están a la vista en el código fuente.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Image as ImageIcon,
  LayoutGrid,
  Lock,
  LogOut,
  Package,
  RotateCcw,
  Scissors,
  Sparkles,
  Type,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import { cx } from '@/lib/format'
import { AdminProductsTab } from './admin/AdminProductsTab'
import { AdminTreatmentsTab } from './admin/AdminTreatmentsTab'
import { AdminCategoriesTab } from './admin/AdminCategoriesTab'
import { AdminTextsTab } from './admin/AdminTextsTab'
import { AdminImagesTab } from './admin/AdminImagesTab'
import {
  checkDemoCredentials,
  isDemoAdminEnabled,
  validateDemoLogin,
} from '@/lib/validation'

type Tab = 'productos' | 'tratamientos' | 'categorias' | 'textos' | 'imagenes'

const TABS: Array<{ id: Tab; label: string; icon: typeof Package }> = [
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'tratamientos', label: 'Tratamientos', icon: Scissors },
  { id: 'categorias', label: 'Categorías', icon: LayoutGrid },
  { id: 'textos', label: 'Textos', icon: Type },
  { id: 'imagenes', label: 'Imágenes', icon: ImageIcon },
]

export default function AdminPage() {
  const mode: 'development' | 'production' = import.meta.env.PROD ? 'production' : 'development'
  const demoEnabled = isDemoAdminEnabled(mode, import.meta.env.VITE_ENABLE_DEMO_ADMIN)
  const [logged, setLogged] = useState(false)

  if (!demoEnabled) {
    return (
      <div className="container-site flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rosa-100 text-rosa-400">
          <Lock aria-hidden="true" className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-light text-tinta-900">Panel desactivado en producción</h1>
        <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-tinta-700">
          Por seguridad, el acceso de demostración al panel está desactivado en builds de
          producción. Si eres el desarrollador, define temporalmente
          <code className="mx-1 rounded bg-beige-100 px-1.5 py-0.5">VITE_ENABLE_DEMO_ADMIN=true</code>
          o actívalo con <code className="mx-1 rounded bg-beige-100 px-1.5 py-0.5">npm run dev</code>.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-full bg-tinta-900 px-7 py-3 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (!logged) return <AdminLogin onLogin={() => setLogged(true)} />

  return <AdminDashboard onLogout={() => setLogged(false)} />
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [failed, setFailed] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validateDemoLogin(user, password)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    if (checkDemoCredentials(user, password)) {
      onLogin()
    } else {
      setFailed(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        noValidate
        className="w-full max-w-md rounded-3xl border border-beige-200 bg-marfil-50 p-8 shadow-lg"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-salvia-100 text-salvia-600">
            <Lock aria-hidden="true" className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl font-light text-tinta-900">
            Panel de administración
          </h1>
          <p className="mt-2 text-sm text-tinta-700">Acceso de demostración</p>
        </div>

        <div
          role="note"
          className="mb-6 flex items-start gap-2.5 rounded-xl border border-rosa-200 bg-rosa-100 px-4 py-3 text-xs leading-relaxed text-tinta-700"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-rosa-400" />
          <p>
            Esta pantalla NO es autenticación real: es una barrera cosmética para la demo. Usa
            <strong className="font-medium"> admin / admin</strong>. En producción está
            desactivada por defecto.
          </p>
        </div>

        {failed && (
          <p
            role="alert"
            className="mb-4 rounded-xl border border-rosa-300 bg-rosa-100 px-4 py-3 text-sm text-rosa-400"
          >
            Credenciales incorrectas. En esta demo el usuario y la contraseña son «admin».
          </p>
        )}

        <label htmlFor="admin-user" className="mb-1.5 block text-sm text-tinta-900">
          Usuario
        </label>
        <input
          id="admin-user"
          value={user}
          onChange={(e) => {
            setUser(e.target.value)
            setErrors({})
            setFailed(false)
          }}
          autoComplete="off"
          className="w-full rounded-xl border border-beige-300 bg-marfil-100 px-4 py-3 text-sm focus:border-oro-400 focus:outline-none"
        />
        {errors.user && <p className="mt-1 text-xs text-rosa-400">{errors.user}</p>}

        <label htmlFor="admin-pass" className="mb-1.5 mt-4 block text-sm text-tinta-900">
          Contraseña
        </label>
        <input
          id="admin-pass"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors({})
            setFailed(false)
          }}
          autoComplete="off"
          className="w-full rounded-xl border border-beige-300 bg-marfil-100 px-4 py-3 text-sm focus:border-oro-400 focus:outline-none"
        />
        {errors.password && <p className="mt-1 text-xs text-rosa-400">{errors.password}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-tinta-900 px-6 py-3.5 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
        >
          Entrar al panel
        </button>

        <Link
          to="/"
          className="mt-4 block text-center text-sm text-tinta-700 hover:text-oro-500 hover:underline"
        >
          Volver a la web
        </Link>
      </form>
    </div>
  )
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('productos')
  const [confirmReset, setConfirmReset] = useState(false)
  const { isCustomized, resetAll } = useStore()
  const { show } = useToast()

  return (
    <div className="min-h-screen bg-marfil-100">
      <header className="border-b border-beige-200 bg-marfil-50">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <Sparkles aria-hidden="true" className="h-5 w-5 text-oro-400" />
            <div>
              <p className="font-display text-base tracking-[0.15em] text-tinta-900">
                ESTÉTICA <span className="italic text-oro-500">GUION</span>
              </p>
              <p className="text-[11px] text-tinta-700">Panel de demostración · datos locales</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCustomized && (
              <span className="hidden rounded-full bg-salvia-100 px-3 py-1.5 text-xs text-salvia-600 sm:inline">
                Cambios guardados en este navegador
              </span>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-full border border-beige-300 px-4 py-2 text-sm text-tinta-700 transition-colors hover:border-oro-400"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="container-site py-8">
        {/* Aviso de seguridad prominente */}
        <div
          role="note"
          className="mb-8 flex items-start gap-3 rounded-2xl border border-rosa-300 bg-rosa-100 px-5 py-4 text-sm leading-relaxed text-tinta-700"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-rosa-400" />
          <p>
            <strong className="font-medium text-tinta-900">Demostración únicamente.</strong> El
            acceso «admin / admin» no es autenticación real y está desactivado en producción por
            defecto. Los cambios se guardan solo en el localStorage de este navegador: no hay
            base de datos compartida ni sincronización entre usuarios o dispositivos.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Secciones del panel"
            className="flex flex-wrap gap-2"
          >
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={cx(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors',
                    active
                      ? 'bg-tinta-900 text-marfil-50'
                      : 'border border-beige-300 bg-marfil-50 text-tinta-700 hover:border-oro-400',
                  )}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            {confirmReset ? (
              <>
                <span className="text-sm text-tinta-700">¿Restablecer todo?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetAll()
                    setConfirmReset(false)
                    show('Datos de ejemplo restablecidos')
                  }}
                  className="rounded-full bg-rosa-400 px-4 py-2 text-sm text-white transition-colors hover:bg-rosa-300"
                >
                  Sí, restablecer
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="rounded-full border border-beige-300 px-4 py-2 text-sm text-tinta-700"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-2 rounded-full border border-beige-300 bg-marfil-50 px-4 py-2.5 text-sm text-tinta-700 transition-colors hover:border-oro-400"
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                Restablecer datos demo
              </button>
            )}
          </div>
        </div>

        <section role="tabpanel" aria-label={`Sección ${tab}`}>
          {tab === 'productos' && <AdminProductsTab />}
          {tab === 'tratamientos' && <AdminTreatmentsTab />}
          {tab === 'categorias' && <AdminCategoriesTab />}
          {tab === 'textos' && <AdminTextsTab />}
          {tab === 'imagenes' && <AdminImagesTab />}
        </section>
      </div>
    </div>
  )
}

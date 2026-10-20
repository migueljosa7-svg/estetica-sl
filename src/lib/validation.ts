/**
 * Validaciones de formularios (contacto, login demo y fichas de admin).
 * Funciones puras → testeadas con Vitest.
 */

export interface ContactValues {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  privacy: boolean
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[+\d][\d\s().-]{6,19}$/

export function validateContact(
  values: ContactValues,
): FieldErrors<ContactValues> {
  const errors: FieldErrors<ContactValues> = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Indica tu nombre (mínimo 2 caracteres).'
  }
  if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Introduce un correo electrónico válido.'
  }
  if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) {
    errors.phone = 'El teléfono no parece válido.'
  }
  if (!values.subject) {
    errors.subject = 'Selecciona un motivo de contacto.'
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'
  }
  if (!values.privacy) {
    errors.privacy = 'Debes aceptar la política de privacidad (demo).'
  }
  return errors
}

/** Credenciales de DEMO. Solo válidas cuando la demo está habilitada. */
export const DEMO_ADMIN_USER = 'admin'
export const DEMO_ADMIN_PASSWORD = 'admin'

/**
 * Indica si el acceso de demostración a /admin está permitido.
 *
 * - En desarrollo (`npm run dev`) está activo por defecto.
 * - En producción solo se activa si VITE_ENABLE_DEMO_ADMIN === 'true'.
 *
 * ADVERTENCIA: esto NO es autenticación real. Es una barrera cosmética
 * para la demo y no debe usarse nunca como sistema de acceso en producción.
 */
export function isDemoAdminEnabled(mode: 'development' | 'production', flag?: string): boolean {
  if (mode === 'development') return true
  return flag === 'true'
}

export function validateDemoLogin(
  user: string,
  password: string,
): FieldErrors<{ user: string; password: string }> {
  const errors: FieldErrors<{ user: string; password: string }> = {}
  if (!user.trim()) errors.user = 'Introduce el usuario.'
  if (!password) errors.password = 'Introduce la contraseña.'
  return errors
}

export function checkDemoCredentials(user: string, password: string): boolean {
  return user.trim() === DEMO_ADMIN_USER && password === DEMO_ADMIN_PASSWORD
}

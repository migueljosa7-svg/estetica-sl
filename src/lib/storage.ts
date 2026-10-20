/**
 * Persistencia en localStorage con tolerancia a errores.
 *
 * IMPORTANTE (demo): los datos se guardan solo en el navegador de cada
 * usuario. No se sincronizan entre personas ni entre dispositivos, y no
 * existe ninguna base de datos compartida detrás.
 */

const PREFIX = 'eg:'

export const STORAGE_KEYS = {
  cart: `${PREFIX}cart:v1`,
  favorites: `${PREFIX}favorites:v1`,
  store: `${PREFIX}store:v1`,
  adminSession: `${PREFIX}admin-session:v1`,
} as const

/** Parsea JSON devolviendo el valor de respaldo si algo falla. */
export function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    const parsed: unknown = JSON.parse(raw)
    return (parsed ?? fallback) as T
  } catch {
    return fallback
  }
}

/** Lee una clave de localStorage de forma segura (SSR/blocked storage incluido). */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    return safeParse<T>(window.localStorage.getItem(key), fallback)
  } catch {
    return fallback
  }
}

/** Escribe en localStorage de forma segura. Devuelve true si se guardó. */
export function writeStorage(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Sin almacenamiento disponible: se ignora en la demo.
  }
}

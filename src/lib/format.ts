/** Utilidades de formato y texto (es-ES). */

const euroFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

export function formatPrice(value: number): string {
  return euroFormatter.format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-ES').format(value)
}

/** Normaliza texto para búsquedas: sin acentos ni mayúsculas. */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Clase CSS condicional breve (sin dependencias). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

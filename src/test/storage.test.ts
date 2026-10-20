import { afterEach, describe, expect, it } from 'vitest'
import { readStorage, removeStorage, safeParse, writeStorage } from '@/lib/storage'

afterEach(() => {
  window.localStorage.clear()
})

describe('storage seguro', () => {
  it('safeParse devuelve el respaldo ante JSON corrupto o nulo', () => {
    expect(safeParse('{mal JSON', { a: 1 })).toEqual({ a: 1 })
    expect(safeParse(null, 'x')).toBe('x')
    expect(safeParse('[1,2]', [])).toEqual([1, 2])
  })

  it('readStorage y writeStorage persisten objetos', () => {
    expect(writeStorage('eg:test', { n: 2 })).toBe(true)
    expect(readStorage('eg:test', {})).toEqual({ n: 2 })
  })

  it('readStorage devuelve el respaldo si la clave no existe', () => {
    expect(readStorage('eg:inexistente', [1])).toEqual([1])
  })

  it('removeStorage elimina la clave', () => {
    writeStorage('eg:tmp', { ok: true })
    removeStorage('eg:tmp')
    expect(readStorage('eg:tmp', null)).toBeNull()
  })
})

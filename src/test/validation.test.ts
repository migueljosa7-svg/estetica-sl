import { describe, expect, it } from 'vitest'
import {
  checkDemoCredentials,
  isDemoAdminEnabled,
  validateContact,
  validateDemoLogin,
} from '@/lib/validation'

const VALID = {
  name: 'Lucía',
  email: 'lucia@example.com',
  phone: '+34600000000',
  subject: 'Reserva de tratamiento',
  message: 'Me gustaría reservar un tratamiento facial la próxima semana.',
  privacy: true,
}

describe('validación de contacto', () => {
  it('acepta un formulario válido sin errores', () => {
    expect(validateContact(VALID)).toEqual({})
  })

  it('detecta nombre corto, email inválido y mensaje breve', () => {
    const errors = validateContact({
      ...VALID,
      name: 'A',
      email: 'no-es-un-email',
      message: 'Hola',
    })
    expect(errors.name).toBeTruthy()
    expect(errors.email).toBeTruthy()
    expect(errors.message).toBeTruthy()
  })

  it('el teléfono es opcional pero se valida si se rellena', () => {
    expect(validateContact({ ...VALID, phone: '' }).phone).toBeUndefined()
    expect(validateContact({ ...VALID, phone: 'abc' }).phone).toBeTruthy()
    expect(validateContact({ ...VALID, phone: '915 123 456' }).phone).toBeUndefined()
  })

  it('exige motivo y aceptación de privacidad', () => {
    const errors = validateContact({ ...VALID, subject: '', privacy: false })
    expect(errors.subject).toBeTruthy()
    expect(errors.privacy).toBeTruthy()
  })
})

describe('acceso demo del panel', () => {
  it('valida campos vacíos del login', () => {
    expect(validateDemoLogin('', '')).toEqual({ user: expect.any(String), password: expect.any(String) })
    expect(validateDemoLogin('admin', 'admin')).toEqual({})
  })

  it('solo acepta admin / admin', () => {
    expect(checkDemoCredentials('admin', 'admin')).toBe(true)
    expect(checkDemoCredentials('admin', 'otra')).toBe(false)
    expect(checkDemoCredentials('Admin', 'admin')).toBe(false)
    expect(checkDemoCredentials('  admin  ', 'admin')).toBe(true)
  })

  it('demo activa en desarrollo, bloqueada en producción salvo flag', () => {
    expect(isDemoAdminEnabled('development')).toBe(true)
    expect(isDemoAdminEnabled('production')).toBe(false)
    expect(isDemoAdminEnabled('production', 'false')).toBe(false)
    expect(isDemoAdminEnabled('production', 'true')).toBe(true)
  })
})

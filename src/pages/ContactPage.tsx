/** Formulario de contacto validado + tarjeta de datos del centro (demo). */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send, TriangleAlert } from 'lucide-react'
import { Reveal } from '@/components/Reveal'
import { useStore } from '@/context/StoreContext'
import { cx } from '@/lib/format'
import { validateContact, type ContactValues, type FieldErrors } from '@/lib/validation'

const SUBJECTS = [
  'Reserva de tratamiento',
  'Consulta sobre cosmética',
  'Información general',
  'Otra cuestión',
]

const EMPTY: ContactValues = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacy: false,
}

export function ContactPage() {
  const { texts } = useStore()
  const [values, setValues] = useState<ContactValues>(EMPTY)
  const [errors, setErrors] = useState<FieldErrors<ContactValues>>({})
  const [sent, setSent] = useState(false)

  const setField = <K extends keyof ContactValues>(key: K, value: ContactValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validateContact(values)
    setErrors(found)
    if (Object.values(found).some(Boolean)) {
      const firstKey = Object.keys(found).find((k) => found[k as keyof ContactValues])
      if (firstKey) document.getElementById(`contacto-${firstKey}`)?.focus()
      return
    }
    setSent(true)
    setValues(EMPTY)
  }

  const fieldClass = (key: keyof ContactValues) =>
    cx(
      'w-full rounded-xl border bg-marfil-50 px-4 py-3 text-sm text-tinta-900 placeholder:text-tinta-700/50 focus:outline-none',
      errors[key] ? 'border-rosa-400' : 'border-beige-300 focus:border-oro-400',
    )

  return (
    <div className="container-site py-12 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-oro-500">
          Hablemos
        </p>
        <h1 className="text-balance-site text-4xl font-light text-tinta-900 sm:text-5xl">
          Contacto y reservas
        </h1>
        <p className="mt-4 text-base font-light leading-relaxed text-tinta-700">
          Este formulario es una demostración: la validación funciona, pero el mensaje no se
          envía a ningún servidor ni se almacena fuera de tu navegador.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
        <Reveal className="lg:col-span-3">
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-3xl border border-beige-200 bg-marfil-50 p-6 sm:p-8"
          >
            {sent && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-salvia-300 bg-salvia-100 px-4 py-3.5 text-sm text-salvia-600"
              >
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  ¡Mensaje simulado enviado! En una web real, el equipo te respondería en menos
                  de 24 h laborables. No se ha guardado ni enviado ningún dato.
                </p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contacto-name" className="mb-1.5 block text-sm text-tinta-900">
                  Nombre *
                </label>
                <input
                  id="contacto-name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => setField('name', e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  placeholder="Tu nombre"
                  className={fieldClass('name')}
                />
                {errors.name && (
                  <p id="error-name" className="mt-1.5 text-xs text-rosa-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="contacto-email" className="mb-1.5 block text-sm text-tinta-900">
                  Correo electrónico *
                </label>
                <input
                  id="contacto-email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => setField('email', e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  placeholder="tu@correo.com"
                  className={fieldClass('email')}
                />
                {errors.email && (
                  <p id="error-email" className="mt-1.5 text-xs text-rosa-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="contacto-phone" className="mb-1.5 block text-sm text-tinta-900">
                  Teléfono (opcional)
                </label>
                <input
                  id="contacto-phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'error-phone' : undefined}
                  placeholder="600 000 000"
                  className={fieldClass('phone')}
                />
                {errors.phone && (
                  <p id="error-phone" className="mt-1.5 text-xs text-rosa-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="contacto-subject" className="mb-1.5 block text-sm text-tinta-900">
                  Motivo *
                </label>
                <select
                  id="contacto-subject"
                  value={values.subject}
                  onChange={(e) => setField('subject', e.target.value)}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'error-subject' : undefined}
                  className={fieldClass('subject')}
                >
                  <option value="">Selecciona un motivo…</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.subject && (
                  <p id="error-subject" className="mt-1.5 text-xs text-rosa-400">{errors.subject}</p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contacto-message" className="mb-1.5 block text-sm text-tinta-900">
                Mensaje *
              </label>
              <textarea
                id="contacto-message"
                rows={5}
                value={values.message}
                onChange={(e) => setField('message', e.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'error-message' : undefined}
                placeholder="Cuéntanos qué tratamiento te interesa o qué duda tienes…"
                className={fieldClass('message')}
              />
              {errors.message && (
                <p id="error-message" className="mt-1.5 text-xs text-rosa-400">{errors.message}</p>
              )}
            </div>

            <div className="mt-5">
              <label className="flex cursor-pointer items-start gap-3 text-sm text-tinta-700">
                <input
                  type="checkbox"
                  checked={values.privacy}
                  onChange={(e) => setField('privacy', e.target.checked)}
                  aria-invalid={Boolean(errors.privacy)}
                  aria-describedby={errors.privacy ? 'error-privacy' : undefined}
                  className="mt-0.5 h-4 w-4 accent-salvia-600"
                />
                <span>
                  He leído y acepto la{' '}
                  <Link to="/legal/privacidad" className="text-oro-500 underline">
                    política de privacidad (demo)
                  </Link>
                  . *
                </span>
              </label>
              {errors.privacy && (
                <p id="error-privacy" className="mt-1.5 text-xs text-rosa-400">{errors.privacy}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-tinta-900 px-8 py-3.5 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
            >
              <Send aria-hidden="true" className="h-4 w-4" />
              Enviar mensaje (demo)
            </button>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-tinta-700">
              <TriangleAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-oro-500" />
              No enviamos datos a ningún servidor: la demostración se ejecuta íntegramente en
              tu navegador.
            </p>
          </form>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <aside className="rounded-3xl border border-beige-200 bg-salvia-100/60 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-light text-tinta-900">El centro</h2>
            <p className="mt-2 text-sm font-light text-tinta-700">
              Datos ficticios de demostración, sin correspondencia con ninguna empresa real.
            </p>
            <ul className="mt-6 space-y-5 text-sm text-tinta-700">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-oro-500" />
                {texts.contactAddress}
              </li>
              <li className="flex items-center gap-3">
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-oro-500" />
                <a href={`tel:${texts.contactPhone.replace(/\s/g, '')}`} className="hover:underline">
                  {texts.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-oro-500" />
                <a href={`mailto:${texts.contactEmail}`} className="hover:underline">
                  {texts.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-oro-500" />
                {texts.contactHours}
              </li>
            </ul>
            <div className="mt-8 rounded-2xl border border-beige-200 bg-marfil-50 p-5">
              <h3 className="text-sm font-medium text-tinta-900">¿Prefieres venir?</h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-tinta-700">
                Trabajamos con cita previa para garantizar tiempos de calidad. Puedes llamar
                directamente o pedir cita desde el formulario.
              </p>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  )
}

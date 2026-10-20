/** Página de inicio: hero editorial, carrusel, destacados, tratamientos, testimonios y FAQ. */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Clock, Mail, Sparkles, Star } from 'lucide-react'
import { Carousel } from '@/components/Carousel'
import { LazyImage } from '@/components/LazyImage'
import { ProductCard } from '@/components/ProductCard'
import { Reveal, Stagger } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/Button'
import { WhatsAppButton } from '@/components/WhatsApp'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import { formatPrice } from '@/lib/format'

export function HomePage() {
  const { texts, slides, products, treatments, testimonials, faq } = useStore()
  const { show } = useToast()
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const featured = products.filter((p) => p.featured).slice(0, 4)
  const featuredTreatments = treatments.filter((t) => t.featured).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-site grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <Reveal variant="fade-up" delay={0.1}>
            <div className="flex flex-col gap-6">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-oro-300 bg-marfil-50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-oro-500">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                {texts.tagline}
              </p>
              <h1 className="text-balance-site font-display text-5xl font-light leading-[1.05] tracking-tight text-tinta-900 sm:text-6xl lg:text-7xl">
                {texts.heroTitle}{' '}
                <em className="font-normal italic text-oro-500">
                  {texts.heroHighlight}
                </em>
              </h1>
              <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-tinta-700 sm:text-lg">
                {texts.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="primary" size="lg" asChild>
                  <Link to="/tratamientos">
                    <Sparkles aria-hidden="true" className="h-4 w-4" />
                    Ver tratamientos
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/tienda">Descubrir cosmética</Link>
                </Button>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-beige-200 pt-6 corner-accent">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-tinta-700">Experiencia</dt>
                  <dd className="mt-1 font-display text-2xl text-tinta-900">12 años</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-tinta-700">Valoración</dt>
                  <dd className="mt-1 flex items-center gap-1 font-display text-2xl text-tinta-900">
                    4,8
                    <Star aria-hidden="true" className="h-4 w-4 fill-oro-400 text-oro-400" />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-tinta-700">Productos</dt>
                  <dd className="mt-1 font-display text-2xl text-tinta-900">{products.length}</dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal variant="zoom-in" delay={0.2}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[40px] border border-beige-200 bg-marfil-50 shadow-card">
              <LazyImage
                src={texts.heroImage}
                alt={texts.heroAlt}
                className="h-full w-full"
                imgClassName="transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[40px] bg-gradient-to-t from-tinta-900/60 via-tinta-900/15 to-transparent"
              />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block rounded-full bg-rosa-400 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-marfil-100 shadow-md">
                  Nuevo en la casa
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-oro-200/40 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-rosa-100/40 blur-[80px]"
        />
      </section>

      {/* CARRUSEL DE NOVEDADES */}
      <section className="py-20">
        <SectionHeading
          eyebrow="Novedades"
          title="Cuidado que encanta"
          description="Selección de la casa para acompañar tu ritual diario."
        />
        <div className="mt-12">
          <Carousel slides={slides} />
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="border-t border-beige-200 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Tienda" title="Cosmética destacada" align="left" />
          <Link
            to="/tienda"
            className="text-sm font-medium text-oro-500 underline-offset-4 transition-colors hover:text-oro-600"
          >
            Ver toda la colección →
          </Link>
        </div>

        <Stagger
          variant="fade-up"
          stagger={0.08}
          className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          itemClassName="h-full"
        >
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdded={(name) => show(`${name} añadido a la cesta`)}
            />
          ))}
        </Stagger>
      </section>

      {/* TRATAMIENTOS DESTACADOS */}
      <section className="py-20">
        <SectionHeading
          eyebrow="Cabina"
          title="Tratamientos faciales y corporales"
          description="Rituales manuales y tecnología suave, diseñados para tu piel."
        />

        <Stagger
          variant="fade-up"
          stagger={0.09}
          className="mt-12 grid gap-8 md:grid-cols-3"
          itemClassName="h-full"
        >
          {featuredTreatments.map((t) => (
              <article
                key={t.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-beige-200 bg-marfil-50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-oro-300 hover:shadow-card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <LazyImage
                    src={t.image}
                    alt={t.name}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-marfil-50/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-tinta-900 backdrop-blur">
                    {t.area === 'facial' ? 'Facial' : 'Corporal'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-light leading-snug text-tinta-900">
                    {t.name}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-tinta-700">{t.summary}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-tinta-700">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5 text-oro-500" />
                      {t.duration} min
                    </span>
                    <span className="font-display text-base text-tinta-900">
                      {formatPrice(t.price)}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-col gap-3">
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/contacto">
                        <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                        Reservar cita
                      </Link>
                    </Button>
                    <WhatsAppButton
                      phone={texts.contactPhone}
                      variant="compact"
                      target={{ type: 'treatment', id: t.id, name: t.name }}
                      value={String(t.price)}
                      className="w-full"
                    />
                  </div>
                </div>
              </article>
            ))}
        </Stagger>
      </section>

      {/* TESTIMONIOS */}
      <section className="border-t border-beige-200 bg-marfil-50/60 py-20">
        <SectionHeading
          eyebrow="Experiencias"
          title="Lo que dicen quienes nos visitan"
        />

        <Stagger
          variant="fade-up"
          stagger={0.08}
          className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3"
          itemClassName="h-full"
        >
          {testimonials.map((t) => (
              <figure
                key={t.id}
                className="flex h-full flex-col rounded-2xl border border-beige-200 bg-white p-6 shadow-soft"
              >
                <div className="mb-4 flex items-center gap-1" aria-label={`${t.rating} de 5 estrellas`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden="true"
                      className={`h-4 w-4 ${i < t.rating ? 'fill-oro-400 text-oro-400' : 'text-beige-300'}`}
                    />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm font-light leading-relaxed text-tinta-700">
                  «{t.text}»
                </blockquote>
                <figcaption className="mt-4 text-sm font-medium text-tinta-900">
                  {t.name}
                  <span className="ml-2 text-xs font-light text-tinta-700/70">{t.city}</span>
                </figcaption>
              </figure>
            ))}
        </Stagger>
      </section>

      {/* FAQ */}
      <section className="border-t border-beige-200 py-20">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Resolvemos tus dudas"
          description="Lo esencial sobre el centro, la tienda y esta demostración técnica."
        />

        <div className="mx-auto mt-10 max-w-3xl divide-y divide-beige-200 overflow-hidden rounded-2xl border border-beige-200 bg-white shadow-soft">
          {faq.map((item) => {
            const open = openFaq === item.id
            return (
              <div key={item.id}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : item.id)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${item.id}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-light text-tinta-900 transition-colors hover:text-oro-500"
                  >
                    {item.question}
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-oro-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-label={item.question}
                  className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm font-light leading-relaxed text-tinta-700">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24">
        <Reveal variant="fade-up">
          <div className="corner-accent relative overflow-hidden rounded-[40px] border border-beige-200 bg-tinta-900 px-8 py-16 text-center sm:px-16 lg:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-oro-500/20 blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-rosa-200/20 blur-[100px]"
            />
            <h2 className="text-balance-site font-display text-3xl font-light text-marfil-50 sm:text-4xl">
              ¿Lista para tu próximo ritual?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-marfil-100/85 sm:text-base">
              Escríbenos y te ayudamos a elegir el tratamiento o la rutina de cosmética ideal
              para tu piel. Respondemos en menos de 24 h laborables.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/contacto">
                  <Mail aria-hidden="true" className="h-4 w-4" />
                  Contactar ahora
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-marfil-50/40 text-marfil-50 hover:border-oro-300 hover:text-oro-300">
                <Link to="/tienda">Explorar la tienda</Link>
              </Button>
              <WhatsAppButton
                phone={texts.contactPhone}
                variant="primary"
                target={{ type: 'treatment', id: 'cta-whatsapp', name: 'una cita' }}
              />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}

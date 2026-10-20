/** Página de inicio: hero editorial, carrusel, destacados, tratamientos, testimonios y FAQ. */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Clock, Quote, Sparkles, Star } from 'lucide-react'
import { Carousel } from '@/components/Carousel'
import { LazyImage } from '@/components/LazyImage'
import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { useToast } from '@/components/Toast'
import { useStore } from '@/context/StoreContext'
import { formatPrice } from '@/lib/format'

export function HomePage() {
  const { texts, slides, products, treatments, testimonials, faq } = useStore()
  const { show } = useToast()
  const reduced = useReducedMotion()
  const [openFaq, setOpenFaq] = useState<string | null>(null)

  const featured = products.filter((p) => p.featured).slice(0, 4)
  const featuredTreatments = treatments.filter((t) => t.featured).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-site grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-oro-300 bg-marfil-50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-oro-500">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              {texts.tagline}
            </p>
            <h1 className="text-balance-site font-display text-5xl font-light leading-[1.05] text-tinta-900 sm:text-6xl lg:text-7xl">
              {texts.heroTitle}{' '}
              <em className="font-normal italic text-oro-500">{texts.heroHighlight}</em>
            </h1>
            <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-tinta-700 sm:text-lg">
              {texts.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/tratamientos"
                className="rounded-full bg-tinta-900 px-7 py-3.5 text-sm text-marfil-50 transition-colors hover:bg-salvia-600"
              >
                Ver tratamientos
              </Link>
              <Link
                to="/tienda"
                className="rounded-full border border-tinta-900/20 px-7 py-3.5 text-sm text-tinta-900 transition-colors hover:border-oro-400 hover:text-oro-500"
              >
                Descubrir cosmética
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-beige-200 pt-6">
              <div>
                <dt className="text-xs uppercase tracking-wide text-tinta-700">Experiencia</dt>
                <dd className="mt-1 font-display text-2xl text-tinta-900">12 años</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-tinta-700">Valoración</dt>
                <dd className="mt-1 flex items-center gap-1 font-display text-2xl text-tinta-900">
                  4,8 <Star aria-hidden="true" className="h-4 w-4 fill-oro-400 text-oro-400" />
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-tinta-700">Tratamientos</dt>
                <dd className="mt-1 font-display text-2xl text-tinta-900">30+</dd>
              </div>
            </dl>
          </motion.div>


          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2rem] shadow-[0_24px_80px_-24px_rgba(74,66,56,0.35)]">
              <LazyImage
                src={texts.heroImage}
                alt={texts.heroAlt}
                loading="eager"
                className="aspect-[4/5] w-full"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-beige-200 bg-marfil-50 px-5 py-4 shadow-lg sm:block">
              <p className="text-xs uppercase tracking-wide text-oro-500">Ritual de la semana</p>
              <p className="mt-1 font-display text-lg text-tinta-900">Hidrafacial Luminosidad</p>
              <p className="mt-0.5 text-sm text-tinta-700">desde {formatPrice(89)} · 60 min</p>
            </div>
          </motion.div>
        </div>
        <a
          href="#destacados"
          aria-label="Bajar al contenido destacado"
          className="mx-auto mb-6 flex w-fit animate-bounce items-center gap-1 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-tinta-700 transition-colors hover:text-oro-500"
        >
          Descubre <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </a>
      </section>

      {/* CARRUSEL */}
      <section className="container-site py-10 sm:py-14">
        <Carousel slides={slides} />
      </section>

      {/* DESTACADOS */}
      <section id="destacados" className="container-site py-12 sm:py-16">
        <SectionHeading
          eyebrow="Selección de la casa"
          title="Nuestros imprescindibles"
          description="Fórmulas de autor creadas con activos elegidos uno a uno: texturas ligeras, resultados visibles y una experiencia sensorial cuidada al detalle."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08}>
              <ProductCard product={product} onAdded={(name) => show(`${name} añadido a la cesta`)} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/tienda"
            className="inline-block rounded-full border border-tinta-900/20 px-8 py-3.5 text-sm text-tinta-900 transition-colors hover:border-oro-400 hover:text-oro-500"
          >
            Ver toda la cosmética
          </Link>
        </div>
      </section>

      {/* TRATAMIENTOS DESTACADOS */}
      <section className="bg-salvia-100/60 py-14 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="En el centro"
            title="Tratamientos que se sienten"
            description="Cada ritual combina técnica manual, activos de alta tolerancia y un tiempo de desconexión diseñado para ti."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredTreatments.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-salvia-200 bg-marfil-50 transition-all hover:-translate-y-1 hover:shadow-[0_16px_48px_-16px_rgba(74,66,56,0.28)]">
                  <LazyImage
                    src={t.image}
                    alt={t.name}
                    className="aspect-[16/10] w-full"
                    imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-oro-500">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      {t.duration} min · {formatPrice(t.price)}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-light text-tinta-900">{t.name}</h3>
                    <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-tinta-700">
                      {t.summary}
                    </p>
                    <Link
                      to="/tratamientos"
                      className="mt-4 inline-flex items-center gap-1.5 self-start text-sm text-salvia-600 transition-colors hover:text-oro-500"
                    >
                      Ver detalles
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="container-site py-14 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <LazyImage
              src={texts.aboutImage}
              alt={texts.aboutAlt}
              className="aspect-[4/3] w-full rounded-3xl"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-oro-500">
              Nuestra filosofía
            </p>
            <h2 className="text-balance-site text-3xl font-light text-tinta-900 sm:text-4xl">
              {texts.aboutTitle}
            </h2>
            <span aria-hidden="true" className="mt-5 block h-px w-16 bg-oro-400" />
            <p className="mt-6 text-base font-light leading-relaxed text-tinta-700">
              {texts.aboutText}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {['Diagnóstico gratuito', 'Tecnología suave', 'Cosmética clean'].map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-beige-200 bg-marfil-50 px-4 py-3 text-center text-xs font-light text-tinta-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="bg-marfil-50 py-14 sm:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="Voces de clientas y clientes"
            title="Lo que cuentan tras su ritual"
            description="Testimonios ficticios creados para esta demostración; no corresponden a personas reales."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-2xl border border-beige-200 bg-marfil-100 p-6">
                  <Quote aria-hidden="true" className="h-6 w-6 text-oro-400" />
                  <blockquote className="mt-3 flex-1 text-sm font-light leading-relaxed text-tinta-700">
                    “{t.text}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-beige-200 pt-4">
                    <p className="text-sm font-medium text-tinta-900">{t.name}</p>
                    <p className="text-xs text-tinta-700">
                      {t.city} · {t.treatment}
                    </p>
                    <p className="mt-1.5 flex items-center gap-0.5" aria-label={`Valoración: ${t.rating} de 5`}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          aria-hidden="true"
                          className={
                            s < t.rating
                              ? 'h-3.5 w-3.5 fill-oro-400 text-oro-400'
                              : 'h-3.5 w-3.5 text-beige-300'
                          }
                        />
                      ))}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-site py-14 sm:py-20">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Resolvemos tus dudas"
          description="Lo esencial sobre el centro, la tienda y esta demostración técnica."
        />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-beige-200 rounded-2xl border border-beige-200 bg-marfil-50">
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

      {/* CTA */}
      <section className="container-site pb-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-tinta-900 px-8 py-14 text-center sm:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-oro-500/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-rosa-400/20 blur-3xl"
            />
            <h2 className="text-balance-site font-display text-3xl font-light text-marfil-50 sm:text-4xl">
              ¿Lista para tu próximo ritual?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-relaxed text-marfil-100/85 sm:text-base">
              Escríbenos y te ayudamos a elegir el tratamiento o la rutina de cosmética ideal
              para tu piel. Respondemos en menos de 24 h laborables.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contacto"
                className="rounded-full bg-marfil-50 px-8 py-3.5 text-sm text-tinta-900 transition-colors hover:bg-oro-300"
              >
                Contactar ahora
              </Link>
              <Link
                to="/tienda"
                className="rounded-full border border-marfil-50/40 px-8 py-3.5 text-sm text-marfil-50 transition-colors hover:border-oro-300 hover:text-oro-300"
              >
                Explorar la tienda
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}


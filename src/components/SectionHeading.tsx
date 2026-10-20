/** Encabezado de sección reutilizable con detalle dorado. */
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'center' | 'left'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <Reveal className={centered ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-oro-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance-site text-3xl font-light text-tinta-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cxSite(
            'mt-4 max-w-2xl text-base font-light leading-relaxed text-tinta-700',
            centered && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
      <span
        aria-hidden="true"
        className={cxSite(
          'mt-5 block h-px w-16 bg-oro-400',
          centered && 'mx-auto',
        )}
      />
    </Reveal>
  )
}

function cxSite(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(' ')
}

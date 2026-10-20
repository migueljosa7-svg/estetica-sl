/** Imagen con carga diferida, esqueleto de reserva y fallback elegante. */
import { useState } from 'react'
import { cx } from '@/lib/format'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  /** Clase del contenedor (por defecto cubre la imagen). */
  imgClassName?: string
  loading?: 'lazy' | 'eager'
}

export function LazyImage({
  src,
  alt,
  className,
  imgClassName,
  loading = 'lazy',
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={cx('relative overflow-hidden', className)}>
      {!loaded && !errored && <div className="skeleton absolute inset-0" aria-hidden="true" />}
      {errored ? (
        <div
          className="flex h-full w-full items-center justify-center bg-beige-100 text-sm text-tinta-700"
          role="img"
          aria-label={alt}
        >
          <span className="px-4 text-center">Imagen no disponible</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cx(
            'h-full w-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}

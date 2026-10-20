/**
 * Animaciones de entrada compartidas.
 * - `Reveal`: aparece al entrar en el viewport (scroll reveal).
 * - `Stagger`: entra en cascada, hijo a hijo.
 * Ambas respetan `prefers-reduced-motion`.
 */
import { Children, type ReactNode } from 'react'
import { motion, useReducedMotion, type TargetAndTransition } from 'framer-motion'

export type RevealVariant = 'fade-up' | 'fade-in' | 'zoom-in' | 'slide-left' | 'slide-right'

interface RevealProps {
  children: ReactNode
  /** Retraso en segundos antes de comenzar la animación. */
  delay?: number
  className?: string
  variant?: RevealVariant
  /** Si es `true` la animación se repite cada vez que el elemento entra en pantalla. */
  repeat?: boolean
}

interface RevealFrames {
  initial: TargetAndTransition
  whileInView: TargetAndTransition
}

const VARIANTS: Record<RevealVariant, RevealFrames> = {
  'fade-up': {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
  },
  'fade-in': {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
  },
  'zoom-in': {
    initial: { opacity: 0, scale: 0.96 },
    whileInView: { opacity: 1, scale: 1 },
  },
  'slide-left': {
    initial: { opacity: 0, x: -24 },
    whileInView: { opacity: 1, x: 0 },
  },
  'slide-right': {
    initial: { opacity: 0, x: 24 },
    whileInView: { opacity: 1, x: 0 },
  },
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Elemento que se revela al entrar en pantalla.
 * Con `prefers-reduced-motion` se renderiza directamente, sin animación.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  variant = 'fade-up',
  repeat = false,
}: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  const cfg = VARIANTS[variant]

  return (
    <motion.div
      className={className}
      initial={cfg.initial}
      whileInView={cfg.whileInView}
      viewport={{ once: !repeat, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps {
  children: ReactNode
  /** Escalón de retraso entre hijos (segundos). */
  stagger?: number
  /** Retraso inicial antes del primer hijo (segundos). */
  delay?: number
  /** Clases del contenedor (puede ser un `grid`). */
  className?: string
  /** Clases aplicadas a cada hijo envuelto. */
  itemClassName?: string
  variant?: RevealVariant
}

/**
 * Anima los hijos en cascada al entrar en pantalla.
 * Cada hijo se envuelve automáticamente en un `motion.div`.
 */
export function Stagger({
  children,
  stagger = 0.07,
  delay = 0,
  className,
  itemClassName,
  variant = 'fade-up',
}: StaggerProps) {
  const reduced = useReducedMotion()
  const items = Children.toArray(children)

  if (reduced) {
    return (
      <div className={className}>
        {items.map((child, index) => (
          <div key={index} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    )
  }

  const horizontal = variant === 'slide-left' || variant === 'slide-right'
  const sign = variant === 'slide-left' ? -1 : 1

  return (
    <div className={className}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          initial={horizontal ? { opacity: 0, x: 20 * sign } : { opacity: 0, y: 20 }}
          whileInView={horizontal ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.55, ease: EASE, delay: delay + index * stagger }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Botón premium con variantes, tamaños, estado de carga y soporte de enlaces.
 * - Uso normal: `<Button onClick={...}>Guardar</Button>`
 * - Como enlace: `<Button asChild><Link to="/x">Ir</Link></Button>`
 */
import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'

export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  className?: string
  /** Evento clic (se desactiva si loading o disabled). */
  onClick?: () => void
  /** Tipo nativo del botón. */
  type?: 'button' | 'submit' | 'reset'
  /** Aria label si no hay texto visible. */
  'aria-label'?: string
  /**
   * Renderiza el hijo como raíz del botón conservando sus estilos.
   * Útil para envolver un `Link` de react-router.
   */
  asChild?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-tinta-900 text-marfil-100 hover:bg-salvia-600 active:bg-salvia-700 shadow-soft',
  secondary:
    'bg-salvia-100 text-tinta-900 hover:bg-salvia-200 active:bg-salvia-300',
  outline:
    'border border-beige-300 bg-transparent text-tinta-800 hover:border-oro-500 hover:text-oro-500 hover:bg-oro-50/10 active:bg-oro-50/20',
  ghost:
    'bg-transparent text-tinta-700 hover:bg-beige-100 hover:text-tinta-900 active:bg-beige-200',
  destructive:
    'bg-rosa-500 text-marfil-100 hover:bg-rosa-600 active:bg-rosa-700',
  link: 'bg-transparent text-oro-500 underline-offset-4 hover:text-oro-600 hover:underline',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-sm',
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-oro-500 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
  asChild = false,
}: ButtonProps) {
  const [pressed, setPressed] = useState(false)

  const isDisabled = disabled || loading
  const classes = [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    pressed ? 'scale-[0.97]' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = loading ? (
    <>
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      />
      <span className="sr-only">Cargando…</span>
    </>
  ) : (
    children
  )

  // Modo enlace: se clona el hijo y se le aplican los estilos del botón.
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>
    const childProps = child.props ?? {}

    return cloneElement(child, {
      className: [childProps.className, classes].filter(Boolean).join(' '),
      'aria-label': ariaLabel ?? childProps['aria-label'],
      'aria-disabled': isDisabled || undefined,
      onClick: isDisabled
        ? undefined
        : (...args: unknown[]) => {
            const original = childProps.onClick as
              | ((...a: unknown[]) => void)
              | undefined
            original?.(...args)
            onClick?.()
          },
    } as Record<string, unknown>)
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      aria-label={ariaLabel}
      aria-disabled={isDisabled || undefined}
      className={classes}
    >
      {content}
    </button>
  )
}


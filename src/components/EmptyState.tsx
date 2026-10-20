/** Estado vacío reutilizable con icono, mensaje y acción opcional. */
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-beige-200 bg-marfil-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-salvia-100 text-salvia-600">
        {icon}
      </div>
      <h3 className="text-xl font-light text-tinta-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm font-light text-tinta-700">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

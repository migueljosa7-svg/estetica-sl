/** Componente profesional de WhatsApp para contacto y reservas. */
import { useState } from 'react'
import { Phone, Send } from 'lucide-react'
import { useToast } from '@/components/Toast'

export interface WhatsAppButtonProps {
  phone: string
  template?: string
  variant?: 'always' | 'compact' | 'primary'
  target?: { type: 'product' | 'treatment'; id: string; name: string }
  value?: string
  className?: string
}

const TEMPLATES = {
  reservation: (p: { name: string; value: string }) =>
    `Hola, quiero reservar ${p.name}. Valor: ${p.value || ''}€. ¿Me puedes confirmar disponibilidad y fechas?`,
  inquiry: (p: { name: string }) =>
    `Hola, quiero saber más sobre ${p.name}. ¿Tienes disponibilidad? ¿Cuánto tiempo dura? ¿A qué precio?`,
  generic: (p: { name: string }) =>
    `Hola, quiero reservar ${p.name}. ¿Me puedes confirmar el precio y la disponibilidad?`,
}

export function WhatsAppButton({
  phone,
  template,
  variant = 'always',
  target,
  value,
  className,
}: WhatsAppButtonProps) {
  const { show } = useToast()
  const [copied, setCopied] = useState(false)

  const phoneDigits = phone.replace(/\D/g, '')
  const templateFn = TEMPLATES.reservation
  const renderedMessage = target
    ? templateFn({
        name: target.name,
        value: value || '',
      })
    : templateFn({ name: '', value: value || '' })

  const fullMessage = template ? template : renderedMessage

  const handleClick = () => {
    const confirmed = window.confirm(
      `Abrir WhatsApp a ${phone} con el mensaje:\n\n${fullMessage}\n\n¿Continuar?`,
    )
    if (confirmed) {
      const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(fullMessage)}`
      window.open(url, '_blank', 'noopener,noreferrer')
      show('Enlace de WhatsApp abierto. Contestarán pronto.')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const baseClass =
    'inline-flex items-center gap-2 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2'
  const variantClass =
    variant === 'primary'
      ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600'
      : variant === 'compact'
      ? 'border-emerald-300 bg-emerald-50 px-3 py-1.5 text-emerald-700 hover:bg-emerald-100'
      : 'border-emerald-400 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        className={`${baseClass} ${variantClass}`}
        aria-label={`WhatsApp: ${fullMessage}`}
        title={variant === 'compact' ? '' : 'Enviar por WhatsApp'}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
          <Phone className="h-4 w-4 text-emerald-600" />
        </span>
        <span className="text-sm font-medium text-emerald-700">
          {variant === 'primary'
            ? 'Reservar'
            : variant === 'compact'
            ? 'WhatsApp'
            : 'Contactar'}
        </span>
        {variant === 'primary' && (
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white">
            <Send className="h-3 w-3" />
          </span>
        )}
      </button>

      {variant === 'compact' && (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={handleClick}
            className="flex-1 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <span className="flex items-center justify-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              WhatsApp
            </span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            <Send className="h-3.5 w-3.5" />
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}
    </div>
  )
}
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
  size?: 'md' | 'lg' | 'xl'
}

const SIZE_CLASSES = {
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-5xl',
} as const

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = 'lg',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = `modal-title-${title ? title.replace(/\s+/g, '-').toLowerCase() : 'dialog'}`

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-3xl bg-white shadow-2xl outline-none animate-scale-in',
          SIZE_CLASSES[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="space-y-0.5">
            {title && (
              <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-gray-900">
                {title}
              </h2>
            )}
            {description && <p className="text-xs text-gray-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-scatch-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

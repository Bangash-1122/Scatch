import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

const TONE_CLASSES: Record<BadgeTone, string> = {
  info: 'bg-scatch-50 text-scatch-700 border-scatch-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
}

export interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

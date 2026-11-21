import type { SVGProps } from 'react'
import { cn } from '@/lib/cn'

export type SpinnerSize = 'sm' | 'md' | 'lg'

const SIZE_PX: Record<SpinnerSize, number> = { sm: 14, md: 18, lg: 26 }

export interface SpinnerProps extends SVGProps<SVGSVGElement> {
  size?: SpinnerSize
  label?: string
}

export function Spinner({ size = 'md', label = 'Loading', className, ...props }: SpinnerProps) {
  return (
    <svg
      role="status"
      aria-label={label}
      viewBox="0 0 24 24"
      width={SIZE_PX[size]}
      height={SIZE_PX[size]}
      className={cn('animate-spin text-current', className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

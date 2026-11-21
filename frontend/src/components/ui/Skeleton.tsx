import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

export interface SkeletonProps {
  className?: string
  style?: CSSProperties
}

/** Shimmering placeholder used while product data or 3D scenes load. */
export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn(
        'animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100',
        className,
      )}
    />
  )
}

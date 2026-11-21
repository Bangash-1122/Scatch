import { cn } from '@/lib/cn'

export interface SceneFallbackProps {
  image?: string
  alt: string
  note?: string
  className?: string
}

/**
 * Static replacement for a 3D scene on low-power devices, when WebGL is
 * unavailable, or when the user prefers reduced motion.
 */
export function SceneFallback({ image, alt, note, className }: SceneFallbackProps) {
  return (
    <div className={cn('flex h-full w-full flex-col items-center justify-center gap-3', className)}>
      {image ? (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="max-h-[78%] w-auto max-w-full object-contain drop-shadow-xl animate-float"
        />
      ) : (
        <img src="/bag-logo.svg" alt={alt} className="w-36 animate-float object-contain" />
      )}
      {note && (
        <p className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          {note}
        </p>
      )}
    </div>
  )
}

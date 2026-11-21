import { Spinner } from './Spinner'

/** Route-level fallback shown while a lazy page chunk downloads. */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3" role="status">
      <Spinner size="lg" className="text-scatch-600" label="Loading page" />
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Loading</p>
    </div>
  )
}

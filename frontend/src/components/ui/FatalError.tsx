export function FatalError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-6 text-center">
      <div className="max-w-sm space-y-3">
        <h1 className="text-2xl font-extrabold text-gray-900">Something went wrong</h1>
        <p className="text-sm text-gray-600">
          The store hit an unexpected error. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-scatch-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-scatch-700"
        >
          Reload store
        </button>
      </div>
    </div>
  )
}

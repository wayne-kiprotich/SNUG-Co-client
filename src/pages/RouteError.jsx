import { useEffect } from 'react'
import { Link, useRouteError } from 'react-router-dom'
import { isChunkError, reloadOnce } from '../lib/reload'

/** Shown when a page crashes, instead of a raw error screen. */
export default function RouteError() {
  const error = useRouteError()
  const stale = isChunkError(error)
  if (import.meta.env.DEV) console.error(error)

  // A missing script file means the site was updated while this tab was open.
  useEffect(() => {
    if (stale) reloadOnce()
  }, [stale])

  if (stale) {
    return (
      <div className="shell py-24">
        <h1 className="type-h1 max-w-2xl">The site was updated.</h1>
        <p className="mt-4 max-w-md text-stone">Reload to get the latest version.</p>
        <button type="button" className="btn btn-primary mt-8" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    )
  }

  return (
    <div className="shell py-24">
      <h1 className="type-h1 max-w-2xl">Something went wrong.</h1>
      <p className="mt-4 max-w-md text-stone">Reload the page. If it keeps happening, message us on WhatsApp and we’ll sort it out.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
          Reload
        </button>
        <Link to="/" className="btn btn-secondary">
          Back to home
        </Link>
      </div>
    </div>
  )
}

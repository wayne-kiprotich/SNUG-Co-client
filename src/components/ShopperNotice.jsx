import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dismissNotice, useNotice } from '../lib/shopper'

/** The short message at the bottom of the page after saving a piece or when something fails. */
export function ShopperNotice() {
  const notice = useNotice()

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(dismissNotice, notice.error ? 6000 : 3500)
    return () => clearTimeout(timer)
  }, [notice])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {notice && (
        <p
          key={notice.id}
          className={`pointer-events-auto flex max-w-md items-center gap-4 rounded-[2px] px-5 py-3 text-[0.9375rem] shadow-lg ${
            notice.error ? 'bg-alert text-paper' : 'bg-ink text-paper'
          }`}
        >
          <span>{notice.message}</span>
          {notice.to && (
            <Link to={notice.to} className="shrink-0 underline underline-offset-4" onClick={dismissNotice}>
              {notice.linkLabel}
            </Link>
          )}
        </p>
      )}
    </div>
  )
}

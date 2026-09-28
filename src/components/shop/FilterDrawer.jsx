import { Link } from 'react-router-dom'
import { useDialog } from '../../hooks/useDialog'
import { SORT_OPTIONS } from '../../lib/catalog'
import { CloseIcon } from '../Icons'

/** Mobile "Filter / Sort" bottom sheet (PRD §11). */
export function FilterDrawer({ open, onClose, catalog, current, hrefFor, onSortChange, resultCount }) {
  const ref = useDialog(open, onClose)

  const option = (active) =>
    `flex min-h-12 items-center justify-between border-b border-line text-[1.0625rem] ${active ? 'font-medium' : ''}`

  return (
    <dialog ref={ref} className="drawer drawer-bottom" aria-label="Filter and sort">
      <div className="flex max-h-[88dvh] flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <p className="font-medium">Filter &amp; sort</p>
          <button type="button" onClick={onClose} className="-mr-2.5 grid size-11 place-items-center rounded-full hover:bg-bone" aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <fieldset className="mt-5">
            <legend className="text-sm text-stone">Category</legend>
            <ul className="mt-1">
              {[{ slug: null, name: 'All' }, { slug: 'new', name: 'New arrivals' }, ...catalog.categories].map((c) => {
                const active = current.category === c.slug
                return (
                  <li key={c.slug ?? 'all'}>
                    <Link to={hrefFor({ category: c.slug })} className={option(active)} aria-current={active ? 'page' : undefined}>
                      {c.name}
                      {active && <span aria-hidden="true">●</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-sm text-stone">Collection</legend>
            <ul className="mt-1">
              {catalog.collections.map((c) => {
                const active = current.collection === c.slug
                return (
                  <li key={c.slug}>
                    <Link
                      to={hrefFor({ collection: active ? null : c.slug })}
                      className={option(active)}
                      aria-current={active ? 'page' : undefined}
                    >
                      {c.name}
                      {active && <span className="text-sm text-stone">Remove</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-sm text-stone">Sort by</legend>
            <div className="mt-1">
              {SORT_OPTIONS.map((s) => (
                <label key={s.value} className={option(current.sort === s.value)}>
                  {s.label}
                  <input
                    type="radio"
                    name="sort-mobile"
                    value={s.value}
                    checked={current.sort === s.value}
                    onChange={() => onSortChange(s.value)}
                    className="size-5 accent-ink"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="shrink-0 border-t border-line p-4">
          <button type="button" className="btn btn-primary w-full" onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
          </button>
        </div>
      </div>
    </dialog>
  )
}

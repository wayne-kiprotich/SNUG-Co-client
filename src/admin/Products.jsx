import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img } from '../components/Img'
import { AVAILABILITY_LABEL, formatPrice } from '../lib/format'
import { api } from './api'
import { ErrorNotice, PageTitle, Spinner, inputClass, smallButton, useToast } from './ui'

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'sold-out', label: 'Sold out' },
]

export function Component() {
  const notify = useToast()
  const [state, setState] = useState({ status: 'loading', products: [], error: null })
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('all')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading' }))
    Promise.all([api.products(), api.taxonomy('categories')])
      .then(([p, c]) => {
        setState({ status: 'ready', products: p.products, error: null })
        setCategories(c.items)
      })
      .catch((error) => setState({ status: 'error', products: [], error }))
  }, [])
  useEffect(load, [load])

  const filtering = Boolean(query.trim() || category || status !== 'all')
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return state.products.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q) || p.slug.includes(q)) &&
        (!category || p.category === category) &&
        (status === 'all' ||
          (status === 'visible' && p.published) ||
          (status === 'hidden' && !p.published) ||
          (status === 'sold-out' && p.availability === 'sold-out')),
    )
  }, [state.products, query, category, status])

  const patch = async (product, changes, message) => {
    setBusyId(product.id)
    try {
      const { product: updated } = await api.updateProduct(product.id, changes)
      setState((s) => ({ ...s, products: s.products.map((p) => (p.id === updated.id ? updated : p)) }))
      notify(message)
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  const move = async (product, direction) => {
    setBusyId(product.id)
    try {
      await api.moveProduct(product.id, direction)
      const { products } = await api.products()
      setState((s) => ({ ...s, products }))
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageTitle title="Products">
        <Link to="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </PageTitle>

      {state.status === 'loading' && <Spinner />}
      {state.status === 'error' && (
        <div className="mt-8">
          <ErrorNotice error={state.error} onRetry={load} />
        </div>
      )}

      {state.status === 'ready' && (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={inputClass}
            />
            <label className="sr-only" htmlFor="product-category">
              Category
            </label>
            <select id="product-category" value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} sm:w-52`}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Status">
              {STATUS_FILTERS.map((f) => (
                <button key={f.value} type="button" className="chip" aria-pressed={status === f.value} onClick={() => setStatus(f.value)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-stone" aria-live="polite">
            {visible.length} of {state.products.length} products
            {filtering && ' shown. Clear the filters to change the order.'}
          </p>

          {visible.length === 0 ? (
            <div className="mt-6 border-y border-line py-12">
              <p className="type-h3">No products match.</p>
              <button
                type="button"
                className="btn btn-secondary mt-4"
                onClick={() => {
                  setQuery('')
                  setCategory('')
                  setStatus('all')
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="mt-2 border-t border-line">
              {visible.map((p) => (
                <li key={p.id} className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 border-b border-line py-4 lg:grid-cols-[4rem_minmax(0,1fr)_10rem_9rem_auto] lg:items-center lg:gap-x-6">
                  <Link to={`/admin/products/${p.id}`} className="block" aria-hidden="true" tabIndex={-1}>
                    <Img id={p.images[0]?.id} alt="" sizes="72px" imgClassName={p.published ? '' : 'opacity-50'} />
                  </Link>

                  <div className="min-w-0">
                    <Link to={`/admin/products/${p.id}`} className="block truncate text-[1.0625rem] hover:underline">
                      {p.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-stone">
                      {formatPrice(p.priceKES)}
                      {!p.published && <span className="ml-2 rounded-full bg-bone-deep px-2 py-0.5 text-xs text-ink">Hidden</span>}
                      {p.featured && <span className="ml-2 rounded-full bg-bone-deep px-2 py-0.5 text-xs text-ink">Featured</span>}
                    </p>
                  </div>

                  <label className="col-span-2 text-sm lg:col-span-1">
                    <span className="sr-only">Availability of {p.name}</span>
                    <select
                      value={p.availability}
                      disabled={busyId === p.id}
                      onChange={(e) => patch(p, { availability: e.target.value }, `${p.name}: ${AVAILABILITY_LABEL[e.target.value].toLowerCase()}`)}
                      className={`${inputClass} h-10 text-sm`}
                    >
                      {Object.entries(AVAILABILITY_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="col-span-2 flex flex-wrap items-center gap-2 lg:col-span-1">
                    <button
                      type="button"
                      className={smallButton}
                      disabled={busyId === p.id}
                      onClick={() => patch(p, { published: !p.published }, p.published ? `${p.name} is hidden` : `${p.name} is visible`)}
                    >
                      {p.published ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      className={smallButton}
                      disabled={busyId === p.id}
                      onClick={() => patch(p, { featured: !p.featured }, p.featured ? `${p.name} is no longer featured` : `${p.name} is featured`)}
                      aria-pressed={p.featured}
                    >
                      {p.featured ? 'Unfeature' : 'Feature'}
                    </button>
                  </div>

                  <div className="col-span-2 flex items-center gap-2 lg:col-span-1 lg:justify-end">
                    <button
                      type="button"
                      className={smallButton}
                      disabled={filtering || busyId === p.id || state.products[0]?.id === p.id}
                      onClick={() => move(p, 'up')}
                      aria-label={`Move ${p.name} earlier`}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className={smallButton}
                      disabled={filtering || busyId === p.id || state.products.at(-1)?.id === p.id}
                      onClick={() => move(p, 'down')}
                      aria-label={`Move ${p.name} later`}
                    >
                      ↓
                    </button>
                    <Link to={`/admin/products/${p.id}`} className={`${smallButton} px-4`}>
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}

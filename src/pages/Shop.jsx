import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { CloseIcon, FilterIcon } from '../components/Icons'
import { ProductGrid, ProductGridSkeleton } from '../components/ProductGrid'
import { FilterDrawer } from '../components/shop/FilterDrawer'
import { ShopToolbarSkeleton } from '../components/shop/ShopSkeleton'
import { CatalogError, EmptyState } from '../components/States'
import { useListing } from '../hooks/useCatalog'
import { EVENTS, track } from '../lib/analytics'
import { filterProducts, searchProducts, sortProducts, SORT_OPTIONS } from '../lib/catalog'
import { useSeo } from '../lib/seo'
import NotFound from './NotFound'

const DEFAULT_SORT = 'featured'

export default function Shop() {
  const { category: categoryParam } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { status, catalog, retry } = useListing()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const closeFilters = useCallback(() => setFiltersOpen(false), [])

  const collectionSlug = searchParams.get('collection')
  const query = searchParams.get('q')?.trim() || ''
  const sort = SORT_OPTIONS.some((s) => s.value === searchParams.get('sort')) ? searchParams.get('sort') : DEFAULT_SORT
  const newOnly = categoryParam === 'new'

  const category = catalog?.categories.find((c) => c.slug === categoryParam)
  const collection = catalog?.collections.find((c) => c.slug === collectionSlug)
  const unknownCategory = catalog && categoryParam && !newOnly && !category

  const products = useMemo(() => {
    if (!catalog) return []
    const base = query ? searchProducts(catalog, query) : catalog.products
    const filtered = filterProducts(base, {
      category: category?.slug,
      collection: collection?.slug,
      newOnly,
    })
    return query && !searchParams.get('sort') ? filtered : sortProducts(filtered, sort)
  }, [catalog, query, category, collection, newOnly, sort, searchParams])

  const title = query
    ? `Results for “${query}”`
    : newOnly
      ? 'New arrivals'
      : category
        ? category.name
        : collection
          ? collection.name
          : 'Shop Snug'
  const intro = query
    ? null
    : newOnly
      ? 'The latest pieces from the Snug & Co. studio.'
      : category?.description || collection?.description || 'Lounge sets, tracksuits, jackets and matchday pieces. Order any piece on WhatsApp.'

  useSeo({
    title: query ? `Search: ${query}` : title === 'Shop Snug' ? 'Shop' : title,
    description: intro || undefined,
    path: categoryParam ? `/shop/${categoryParam}` : '/shop',
  })

  useEffect(() => {
    if (catalog && query) track(EVENTS.searchPerformed, { query, results: products.length, placement: 'shop' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, query])

  useEffect(() => {
    if (catalog && (category || newOnly || collection)) {
      track(EVENTS.categoryViewed, { category: category?.slug || (newOnly ? 'new' : null), collection: collection?.slug || null })
    }
  }, [catalog, category, collection, newOnly])

  const hrefFor = useCallback(
    (changes) => {
      const nextCategory = 'category' in changes ? changes.category : categoryParam
      const params = new URLSearchParams(searchParams)
      if ('collection' in changes) {
        if (changes.collection) params.set('collection', changes.collection)
        else params.delete('collection')
      }
      if ('q' in changes && !changes.q) params.delete('q')
      const qs = params.toString()
      return `/shop${nextCategory ? `/${nextCategory}` : ''}${qs ? `?${qs}` : ''}`
    },
    [categoryParam, searchParams],
  )

  const setSort = (value) => {
    const params = new URLSearchParams(searchParams)
    if (value === DEFAULT_SORT) params.delete('sort')
    else params.set('sort', value)
    setSearchParams(params, { replace: true, preventScrollReset: true })
  }

  if (unknownCategory) return <NotFound />

  const current = { category: newOnly ? 'new' : category?.slug ?? null, collection: collection?.slug ?? null, sort }
  const chipCategories = catalog ? [{ slug: null, name: 'All' }, { slug: 'new', name: 'New' }, ...catalog.categories] : []

  return (
    <div className="shell pb-20 pt-8 lg:pb-28 lg:pt-14">
      <header className="max-w-3xl">
        <h1 className="type-h1">{title}</h1>
        {intro && <p className="mt-3 max-w-xl text-[1.0625rem] text-stone">{intro}</p>}
      </header>

      {!catalog && status === 'loading' && <ShopToolbarSkeleton />}
      {catalog && (
        <>
          <div className="mt-8 hidden items-center justify-between gap-6 border-y border-line py-4 md:flex">
            <nav aria-label="Categories" className="flex min-w-0 flex-wrap items-center gap-2">
              {chipCategories.map((c) => (
                <Link
                  key={c.slug ?? 'all'}
                  to={hrefFor({ category: c.slug })}
                  className="chip"
                  aria-current={current.category === c.slug ? 'page' : undefined}
                  preventScrollReset
                >
                  {c.name}
                </Link>
              ))}
              <span className="mx-2 h-6 w-px bg-line" aria-hidden="true" />
              {catalog.collections.map((c) => (
                <Link
                  key={c.slug}
                  to={hrefFor({ collection: current.collection === c.slug ? null : c.slug })}
                  className="chip"
                  aria-pressed={current.collection === c.slug}
                  preventScrollReset
                >
                  {c.name}
                </Link>
              ))}
            </nav>
            <label className="flex shrink-0 items-center gap-2 text-sm">
              <span className="text-stone">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 rounded-sm border border-line bg-paper px-3 text-sm hover:border-ink"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between border-y border-line py-2 md:hidden">
            <p className="text-sm text-stone" aria-live="polite">
              {products.length} {products.length === 1 ? 'piece' : 'pieces'}
            </p>
            <button type="button" className="-mr-2 flex min-h-11 items-center gap-2 px-2 text-[0.9375rem]" onClick={() => setFiltersOpen(true)}>
              <FilterIcon />
              Filter / Sort
            </button>
          </div>

          {(collection || query) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {collection && (
                <Link to={hrefFor({ collection: null })} className="chip gap-2" aria-label={`Remove filter: ${collection.name}`}>
                  {collection.name}
                  <CloseIcon width={14} height={14} />
                </Link>
              )}
              {query && (
                <Link to={hrefFor({ q: null })} className="chip gap-2" aria-label={`Clear search: ${query}`}>
                  “{query}”
                  <CloseIcon width={14} height={14} />
                </Link>
              )}
            </div>
          )}

          <FilterDrawer
            open={filtersOpen}
            onClose={closeFilters}
            catalog={catalog}
            current={current}
            hrefFor={hrefFor}
            onSortChange={setSort}
            resultCount={products.length}
          />
        </>
      )}

      <div className="mt-8 lg:mt-10">
        {status === 'loading' && <ProductGridSkeleton />}
        {status === 'error' && <CatalogError onRetry={retry} />}
        {status === 'ready' && products.length > 0 && <ProductGrid products={products} priorityCount={4} />}
        {status === 'ready' && products.length === 0 && (
          <EmptyState
            title={query ? 'No pieces found' : 'Nothing here right now.'}
            body={query ? 'Try a different word, or explore a category.' : 'Explore the full collection.'}
            actions={
              <>
                {query && (
                  <button type="button" className="chip" onClick={() => navigate(hrefFor({ q: null }))}>
                    Clear search
                  </button>
                )}
                <Link to="/shop" className="chip">
                  Shop all
                </Link>
                {catalog.categories
                  .filter((c) => c.slug !== category?.slug)
                  .map((c) => (
                    <Link key={c.slug} to={`/shop/${c.slug}`} className="chip">
                      {c.name}
                    </Link>
                  ))}
              </>
            }
          />
        )}
      </div>
    </div>
  )
}

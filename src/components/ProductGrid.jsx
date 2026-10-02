import { ProductCard, ProductCardSkeleton } from './ProductCard'

const gridClass = 'grid grid-cols-2 gap-x-2.5 gap-y-9 sm:gap-x-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-12'

export function ProductGrid({ products, priorityCount = 0 }) {
  return (
    <ul className={gridClass}>
      {products.map((p, i) => (
        <li key={p.id}>
          {/* Only the first photo gets high priority; the rest of the first row is eager, the others lazy. */}
          <ProductCard product={p} priority={i === 0 && priorityCount > 0} eager={i < priorityCount} />
        </li>
      ))}
    </ul>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className={gridClass} role="status" aria-label="Loading pieces">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

const railClass =
  'no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-x-4 md:gap-y-10 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-x-5'
const railItemClass = 'w-[68vw] max-w-72 shrink-0 snap-start md:w-auto md:max-w-none'

export function ProductRail({ products }) {
  return (
    <ul className={railClass}>
      {products.map((p) => (
        <li key={p.id} className={railItemClass}>
          <ProductCard product={p} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 31vw, 68vw" />
        </li>
      ))}
    </ul>
  )
}

/** Same shape as ProductRail, so nothing moves when the pieces arrive. */
export function ProductRailSkeleton({ count = 4 }) {
  return (
    <div className={railClass} role="status" aria-label="Loading pieces">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={railItemClass}>
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  )
}

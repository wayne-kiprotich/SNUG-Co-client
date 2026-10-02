import { ProductGridSkeleton } from '../ProductGrid'

/** Same height as the shop's filter bars, so the grid doesn't jump down when they arrive. */
export function ShopToolbarSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mt-8 hidden items-center gap-2 border-y border-line py-4 md:flex">
        {[64, 64, 112, 96, 120, 88].map((w, i) => (
          <div key={i} className="skeleton h-10 rounded-full" style={{ width: w }} />
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-y border-line py-2 md:hidden">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-11 w-28" />
      </div>
    </div>
  )
}

/** The whole shop page while its code loads. */
export function ShopSkeleton() {
  return (
    <div className="shell pb-20 pt-8 lg:pb-28 lg:pt-14" role="status" aria-label="Loading the shop">
      <div className="max-w-3xl" aria-hidden="true">
        <div className="skeleton h-[clamp(2rem,1.5rem+2.4vw,3.5rem)] w-56" />
        {/* Two lines of the 17px intro (line height 1.6). */}
        <div className="mt-3 flex h-[1.7rem] max-w-xl items-center">
          <div className="skeleton h-4 w-full" />
        </div>
        <div className="flex h-[1.7rem] items-center">
          <div className="skeleton h-4 w-2/3 max-w-sm" />
        </div>
      </div>
      <ShopToolbarSkeleton />
      <div className="mt-8 lg:mt-10">
        <ProductGridSkeleton />
      </div>
    </div>
  )
}

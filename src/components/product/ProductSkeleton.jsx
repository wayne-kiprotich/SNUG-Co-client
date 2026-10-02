import { formatPrice } from '../../lib/format'
import { Img } from '../Img'

/**
 * The product page's shape while it loads. preview: card-sized data from the page the shopper
 * came from, so the photo, name and price show at once.
 */
export function ProductSkeleton({ preview }) {
  const image = preview?.images[0]
  return (
    <div className="lg:shell lg:grid lg:grid-cols-12 lg:gap-12 lg:pt-6" role="status" aria-label="Loading this piece">
      <div className="flex gap-2 lg:col-span-7">
        <div className="w-full md:w-1/2">
          {image ? (
            <Img id={image.id} alt={image.alt} sizes="(min-width: 1024px) 28vw, (min-width: 768px) 50vw, 100vw" ladder="large" priority />
          ) : (
            <div className="skeleton aspect-[4/5]" />
          )}
        </div>
        <div className="skeleton hidden aspect-[4/5] w-1/2 md:block" />
      </div>

      <div className="gutter pt-6 lg:col-span-5 lg:pt-2" aria-hidden="true">
        {/* Each line matches the real line's height, so nothing shifts when the piece arrives. */}
        <div className="flex h-[1.4rem] items-center">
          <div className="skeleton h-4 w-32" />
        </div>
        {preview ? (
          <p className="type-h1 mt-3 text-[clamp(1.875rem,1.4rem+1.6vw,2.75rem)]">{preview.name}</p>
        ) : (
          <div className="skeleton mt-3 h-[clamp(1.875rem,1.4rem+1.6vw,2.75rem)] w-3/4" />
        )}
        {preview ? (
          <p className={`mt-4 text-[1.25rem] ${preview.priceKES == null ? 'text-stone' : ''}`} style={{ fontStretch: '104%' }}>
            {formatPrice(preview.priceKES)}
          </p>
        ) : (
          <div className="mt-4 flex h-8 items-center">
            <div className="skeleton h-6 w-28" />
          </div>
        )}
        <div className="mt-1 flex h-[1.4rem] items-center">
          <div className="skeleton h-4 w-36" />
        </div>
        <div className="mt-8 flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton size-12" />
          ))}
        </div>
        <div className="skeleton mt-8 h-14 w-full" />
      </div>
    </div>
  )
}

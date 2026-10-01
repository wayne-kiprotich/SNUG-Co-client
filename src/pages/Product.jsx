import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronIcon } from '../components/Icons'
import { imageSrc } from '../components/Img'
import { OrderPanel } from '../components/product/OrderPanel'
import { ProductGallery } from '../components/product/ProductGallery'
import { ProductGridSkeleton, ProductRail } from '../components/ProductGrid'
import { SectionHeading } from '../components/SectionHeading'
import { CatalogError } from '../components/States'
import { site } from '../config/site'
import { useCatalog } from '../hooks/useCatalog'
import { EVENTS, track } from '../lib/analytics'
import { relatedProducts } from '../lib/catalog'
import { absoluteUrl, useSeo } from '../lib/seo'

const SCHEMA_AVAILABILITY = {
  'sold-out': 'https://schema.org/OutOfStock',
  'coming-soon': 'https://schema.org/PreOrder',
  'low-stock': 'https://schema.org/LimitedAvailability',
}

function productJsonLd(product, category) {
  const url = absoluteUrl(`/product/${product.slug}`)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    url,
    image: product.images.length
      ? product.images.map((img) => absoluteUrl(imageSrc(img.id) || '/og-default.jpg'))
      : [absoluteUrl('/og-default.jpg')],
    brand: { '@type': 'Brand', name: site.brandName },
    category: category?.name,
  }
  if (product.material) data.material = product.material
  if (product.priceKES != null) {
    data.offers = {
      '@type': 'Offer',
      url,
      priceCurrency: 'KES',
      price: product.priceKES,
      ...(product.madeToOrder && { availability: 'https://schema.org/MadeToOrder' }),
      ...(SCHEMA_AVAILABILITY[product.availability] && { availability: SCHEMA_AVAILABILITY[product.availability] }),
    }
  }
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Shop', item: absoluteUrl('/shop') },
      ...(category ? [{ '@type': 'ListItem', position: 2, name: category.name, item: absoluteUrl(`/shop/${category.slug}`) }] : []),
      { '@type': 'ListItem', position: category ? 3 : 2, name: product.name, item: url },
    ],
  }
  return [data, breadcrumb]
}

export default function Product() {
  const { slug } = useParams()
  const { status, catalog, retry } = useCatalog()
  const product = catalog?.products.find((p) => p.slug === slug)
  const category = product && catalog.categories.find((c) => c.slug === product.category)

  useSeo(
    product
      ? {
          title: product.name,
          description: `${product.description.split('. ')[0]}. ${product.priceKES != null ? `KSh ${product.priceKES.toLocaleString('en-KE')}. ` : ''}Order on WhatsApp from ${site.brandName}, Nairobi.`,
          path: `/product/${product.slug}`,
          image: imageSrc(product.images[0]?.id, 1080) || undefined,
          type: 'product',
          jsonLd: productJsonLd(product, category),
        }
      : { title: status === 'ready' ? 'Piece not found' : 'Shop', path: `/product/${slug}` },
  )

  useEffect(() => {
    if (product) track(EVENTS.productViewed, { product: product.slug, category: product.category, price: product.priceKES })
  }, [product])

  if (status === 'loading') {
    return (
      <div className="shell py-10">
        <ProductGridSkeleton count={2} />
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="shell py-10">
        <CatalogError onRetry={retry} />
      </div>
    )
  }
  if (!product) return <MissingProduct catalog={catalog} />

  const related = relatedProducts(catalog, product)

  return (
    <>
      <div className="lg:shell lg:grid lg:grid-cols-12 lg:gap-12 lg:pt-6">
        <div className="lg:col-span-7">
          <ProductGallery key={product.slug} product={product} />
        </div>

        <div className="gutter pt-6 lg:col-span-5 lg:pt-2">
          <div className="lg:sticky lg:top-24">
            <nav aria-label="Breadcrumb" className="text-sm text-stone">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li>
                  <Link to="/shop" className="hover:text-ink hover:underline">
                    Shop
                  </Link>
                </li>
                {category && (
                  <>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link to={`/shop/${category.slug}`} className="hover:text-ink hover:underline">
                        {category.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            <h1 className="type-h1 mt-3 text-[clamp(1.875rem,1.4rem+1.6vw,2.75rem)]">{product.name}</h1>

            <div className="mt-4">
              <OrderPanel key={product.slug} product={product} />
            </div>

            <ProductDetails product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="shell pb-24 pt-20 lg:pb-28 lg:pt-28">
          <SectionHeading id="related-title" title="You may also like" link={category && { to: `/shop/${category.slug}`, label: `More ${category.name.toLowerCase()}` }} />
          <div className="mt-8">
            <ProductRail products={related} />
          </div>
        </section>
      )}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  )
}

function ProductDetails({ product }) {
  const sections = [
    product.details?.length > 0 && {
      title: 'Details',
      body: (
        <ul className="list-disc space-y-1 pl-5 marker:text-taupe">
          {product.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ),
    },
    product.material && { title: 'Material', body: <p>{product.material}</p> },
    product.care && { title: 'Care', body: <p>{product.care}</p> },
    {
      title: 'Ordering & delivery',
      body: (
        <p>
          Orders are confirmed on WhatsApp, where we agree availability, payment and delivery with you.
          {product.madeToOrder ? ' This piece is made on order.' : ''}{' '}
          <Link to="/shipping-and-orders" className="link">
            Read how ordering works
          </Link>
          .
        </p>
      ),
    },
  ].filter(Boolean)

  return (
    <div className="mt-10 border-t border-line">
      {sections.map((s, i) => (
        <details key={s.title} className="group border-b border-line" open={i === 0}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[0.9375rem]">
            {s.title}
            <ChevronIcon className="shrink-0 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="pb-5 text-[0.9375rem] leading-relaxed text-stone">{s.body}</div>
        </details>
      ))}
    </div>
  )
}

function MissingProduct({ catalog }) {
  const suggestions = catalog.products.filter((p) => p.newArrival).slice(0, 4)
  return (
    <div className="shell pb-24 pt-14 lg:pt-20">
      <h1 className="type-h1 max-w-2xl">This piece is no longer available.</h1>
      <p className="mt-4 max-w-md text-stone">It may have sold out or moved. Browse what’s in the collection now.</p>
      <Link to="/shop" className="btn btn-primary mt-8">
        Go to the shop
      </Link>
      {suggestions.length > 0 && (
        <section aria-labelledby="missing-new" className="mt-20">
          <SectionHeading id="missing-new" title="New arrivals" link={{ to: '/shop/new', label: 'Shop all' }} />
          <div className="mt-8">
            <ProductRail products={suggestions} />
          </div>
        </section>
      )}
    </div>
  )
}

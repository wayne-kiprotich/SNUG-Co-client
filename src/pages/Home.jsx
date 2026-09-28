import { BrandStatement } from '../components/home/BrandStatement'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { FeatureStory } from '../components/home/FeatureStory'
import { Hero } from '../components/home/Hero'
import { HisAndHers } from '../components/home/HisAndHers'
import { Testimonials } from '../components/home/Testimonials'
import { ProductGridSkeleton, ProductRail } from '../components/ProductGrid'
import { SectionHeading } from '../components/SectionHeading'
import { SocialGallery } from '../components/SocialGallery'
import { CatalogError } from '../components/States'
import { StoreLocation } from '../components/StoreLocation'
import { useCatalog } from '../hooks/useCatalog'
import { storeJsonLd, useSeo } from '../lib/seo'

export default function Home() {
  const { status, catalog, retry } = useCatalog()
  useSeo({ path: '/', jsonLd: storeJsonLd() })

  // Four fills one desktop row; the full list lives at /shop/new.
  const newArrivals = catalog ? catalog.products.filter((p) => p.newArrival).slice(0, 4) : []

  return (
    <>
      <Hero />

      {(status !== 'ready' || newArrivals.length > 0) && (
        <section aria-labelledby="new-title" className="shell pb-4 pt-16 lg:pt-20">
          <SectionHeading id="new-title" title="New arrivals" link={{ to: '/shop/new', label: 'Shop all' }} />
          <div className="mt-8 lg:mt-10">
            {status === 'loading' && <ProductGridSkeleton count={4} />}
            {status === 'error' && <CatalogError onRetry={retry} />}
            {status === 'ready' && <ProductRail products={newArrivals} />}
          </div>
        </section>
      )}

      {catalog && <CategoryShowcase catalog={catalog} />}
      <BrandStatement />
      <FeatureStory />
      {catalog && <HisAndHers catalog={catalog} />}
      <Testimonials />
      <SocialGallery />
      <StoreLocation />
    </>
  )
}

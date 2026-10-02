import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { EVENTS, track } from '../../lib/analytics'
import { useSettings } from '../../lib/settings'
import { Img } from '../Img'

const HERO_SIZES = '(min-width: 1024px) 48vw, 100vw'

export function Hero() {
  const settings = useSettings()
  const heroImage = settings?.heroImage

  // Phones: words and buttons first so the first screen can be acted on; the photo follows.
  // Wide screens: words left, photo right.
  return (
    <section aria-labelledby="hero-title" className="flex flex-col lg:shell lg:min-h-[calc(100svh-6.75rem)] lg:flex-row lg:items-stretch lg:gap-10 lg:pb-10">
      <div className="order-2 lg:h-[min(calc(100svh-8rem),60rem)] lg:shrink-0">
        {settings ? (
          <Img id={heroImage} alt={settings.heroAlt} sizes={HERO_SIZES} ladder="large" priority className="lg:h-full" />
        ) : (
          <div className="bg-bone lg:h-full" style={{ aspectRatio: '4 / 5' }} />
        )}
      </div>

      <div className="gutter order-1 flex flex-col justify-end pb-8 pt-6 [container-type:inline-size] lg:flex-1 lg:pb-2 lg:pt-10">
        <p className="text-[0.8125rem] tracking-[0.14em] text-stone">SNUG &amp; CO. — NAIROBI</p>
        <h1 id="hero-title" className="type-display mt-4 text-[clamp(2.5rem,15.5cqi,7.25rem)] lg:mt-5">
          <span className="hero-rise block" style={{ '--i': 0 }}>
            Minimal,
          </span>
          <span className="hero-rise block" style={{ '--i': 1 }}>
            Luxurious <span className="amp">&amp;</span>
          </span>
          <span className="hero-rise block" style={{ '--i': 2 }}>
            Effortlessly
          </span>
          <span className="hero-rise block" style={{ '--i': 3 }}>
            you.
          </span>
        </h1>
        <p className="mt-5 max-w-sm text-[1.0625rem] text-stone lg:mt-6">{site.statement}</p>
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3 lg:mt-8">
          <Link to="/shop" className="btn btn-primary px-3 sm:px-6" onClick={() => track(EVENTS.shopCtaClicked, { placement: 'hero' })}>
            Shop collection
          </Link>
          <Link to="/shop/new" className="btn btn-secondary px-3 sm:px-6" onClick={() => track(EVENTS.shopCtaClicked, { placement: 'hero-new' })}>
            New arrivals
          </Link>
        </div>
      </div>
    </section>
  )
}

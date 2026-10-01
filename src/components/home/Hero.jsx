import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { EVENTS, track } from '../../lib/analytics'
import { useSettings } from '../../lib/settings'
import { Img } from '../Img'

export function Hero() {
  const settings = useSettings()
  return (
    <section aria-labelledby="hero-title" className="lg:shell lg:flex lg:min-h-[calc(100svh-6.75rem)] lg:items-stretch lg:gap-10 lg:pb-10">
      <div className="hero-unveil lg:order-2 lg:h-[min(calc(100svh-8rem),60rem)] lg:shrink-0">
        {settings ? (
          <Img id={settings.heroImage} alt={settings.heroAlt} sizes="(min-width: 1024px) 48vw, 100vw" priority className="lg:h-full" />
        ) : (
          <div className="bg-bone lg:h-full" style={{ aspectRatio: '4 / 5' }} />
        )}
      </div>

      <div className="gutter flex flex-col justify-end pb-12 pt-7 [container-type:inline-size] lg:order-1 lg:flex-1 lg:pb-2 lg:pt-10">
        <p className="hero-rise text-[0.8125rem] tracking-[0.14em] text-stone" style={{ '--i': 0 }}>
          SNUG &amp; CO. — NAIROBI
        </p>
        <h1 id="hero-title" className="type-display mt-5 text-[clamp(2.5rem,15.5cqi,7.25rem)]">
          <span className="hero-rise block" style={{ '--i': 1 }}>
            Minimal,
          </span>
          <span className="hero-rise block" style={{ '--i': 2 }}>
            Luxurious <span className="amp">&amp;</span>
          </span>
          <span className="hero-rise block" style={{ '--i': 3 }}>
            Effortlessly
          </span>
          <span className="hero-rise block" style={{ '--i': 4 }}>
            you.
          </span>
        </h1>
        <p className="hero-rise mt-6 max-w-sm text-[1.0625rem] text-stone" style={{ '--i': 5 }}>
          {site.statement}
        </p>
        <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ '--i': 6 }}>
          <Link to="/shop" className="btn btn-primary" onClick={() => track(EVENTS.shopCtaClicked, { placement: 'hero' })}>
            Shop collection
          </Link>
          <Link to="/shop/new" className="btn btn-secondary" onClick={() => track(EVENTS.shopCtaClicked, { placement: 'hero-new' })}>
            Explore new arrivals
          </Link>
        </div>
      </div>
    </section>
  )
}

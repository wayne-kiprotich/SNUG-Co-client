import { Link } from 'react-router-dom'
import { EVENTS, track } from '../../lib/analytics'
import { Img } from '../Img'
import { SectionHeading } from '../SectionHeading'

/** Large image-led category tiles. Alternate tiles drop lower on desktop to break the grid. */
export function CategoryShowcase({ catalog }) {
  const counts = catalog.products.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {})
  const tiles = catalog.categories.filter((c) => counts[c.slug])

  return (
    <section aria-labelledby="collections" className="shell scroll-mt-20 py-16 lg:py-24">
      <SectionHeading id="collections" title="Shop by category" link={{ to: '/shop', label: 'Shop all' }} />
      <ul className="mt-8 grid grid-cols-2 gap-x-2.5 gap-y-8 sm:gap-x-4 lg:mt-12 lg:grid-cols-4 lg:gap-x-5">
        {tiles.map((c, i) => (
          <li key={c.slug} className={i % 2 === 1 ? 'lg:mt-16' : ''}>
            <Link
              to={`/shop/${c.slug}`}
              className="group block"
              onClick={() => track(EVENTS.collectionClicked, { category: c.slug, placement: 'home' })}
            >
              <div className="overflow-hidden">
                <Img
                  id={c.image}
                  alt=""
                  sizes="(min-width: 1024px) 23vw, 48vw"
                  imgClassName="transition-transform duration-[900ms] ease-[var(--ease-soft)] group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="type-h3 group-hover:underline group-hover:underline-offset-4">{c.name}</h3>
                <span className="shrink-0 text-sm text-stone">{counts[c.slug]}</span>
              </div>
              <p className="mt-1 hidden text-sm text-stone sm:block">{c.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

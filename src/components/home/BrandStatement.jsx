import { Link } from 'react-router-dom'
import { site } from '../../config/site'

export function BrandStatement() {
  return (
    <section aria-labelledby="statement-title" className="bg-bone">
      <div className="shell grid gap-8 py-16 lg:grid-cols-12 lg:gap-10 lg:py-28">
        <h2 id="statement-title" className="type-display lg:col-span-7">
          Comfort, elevated.
        </h2>
        <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-[1.125rem] leading-relaxed">{site.bio}</p>
          <ul className="mt-6 border-t border-taupe/50 text-[0.9375rem]">
            {site.values.map((v) => (
              <li key={v} className="border-b border-taupe/50 py-3">
                {v}
              </li>
            ))}
          </ul>
          <Link to="/about" className="link tap mt-6 inline-block text-[0.9375rem]">
            About Snug & Co.
          </Link>
        </div>
      </div>
    </section>
  )
}

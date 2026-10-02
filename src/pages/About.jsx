import { Link } from 'react-router-dom'
import { InstagramLink } from '../components/ContactLinks'
import { InstagramIcon } from '../components/Icons'
import { Img } from '../components/Img'
import { StoreLocation } from '../components/StoreLocation'
import { site } from '../config/site'
import { useSeo } from '../lib/seo'

export default function About() {
  useSeo({
    title: 'About',
    description: `${site.brandName} is a Nairobi clothing brand. ${site.statement} Established ${site.established}.`,
    path: '/about',
  })

  return (
    <>
      <section className="lg:shell lg:grid lg:grid-cols-12 lg:gap-10 lg:pt-10">
        <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1">
          <Img
            id="editorial-his-hers-1"
            alt="Two models in Snug & Co. pieces: a cream sweatshirt with brown shorts and a maroon retro jacket"
            sizes="(min-width: 1024px) 48vw, 100vw"
            ladder="large"
            priority
          />
        </div>
        <div className="gutter pb-6 pt-8 lg:col-span-5 lg:row-start-1 lg:self-end lg:pb-4">
          <p className="text-stone">About {site.brandName}</p>
          <h1 className="type-display mt-4 lg:text-[clamp(3rem,4.6vw,5.5rem)]">{site.statement}</h1>
        </div>
      </section>

      <section aria-labelledby="story-title" className="shell grid gap-10 py-16 lg:grid-cols-12 lg:gap-10 lg:py-28">
        <h2 id="story-title" className="type-h2 lg:col-span-4">
          Started in Nairobi in {site.established}.
        </h2>
        <div className="max-w-2xl space-y-5 text-[1.125rem] leading-relaxed lg:col-span-7 lg:col-start-6">
          <p>
            {site.brandName} makes comfortable clothes that still look put together: lounge sets, tracksuits, statement
            jackets and football-inspired pieces, for people who refuse to choose between feeling good and looking good.
          </p>
          <figure className="border-l-2 border-espresso py-1 pl-6">
            <blockquote>
              <p style={{ fontStretch: '106%' }}>
                “What started as an idea I was scared to fully pursue is becoming something real. Stylish comfort wear,
                statement match-day pieces, and clothes made for people who refuse to choose between feeling good and
                looking good.”
              </p>
            </blockquote>
            <figcaption className="mt-3 text-sm text-stone">From our shoot day, shared on Instagram</figcaption>
          </figure>
          <p>
            Many pieces are made on order and pressed by hand before they go out. Style has no gender here, and neither does
            comfort, which is why so much of what we make comes as his and hers.
          </p>
        </div>
      </section>

      <section aria-labelledby="philosophy-title" className="bg-bone">
        <div className="shell py-16 lg:py-24">
          <h2 id="philosophy-title" className="type-h2">
            {site.signOff}
          </h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { title: site.values[0], body: 'Soft fabrics and relaxed fits you can live in, from slow mornings to match day.' },
              { title: site.values[1], body: 'Clean lines and considered colour that stay easy to wear season after season.' },
              { title: site.values[2], body: 'Every piece is thought through, from the stripe placement to the final press.' },
            ].map((v) => (
              <li key={v.title} className="border-t border-taupe/60 pt-5">
                <h3 className="type-h3">{v.title}</h3>
                <p className="mt-2 text-stone">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="In the workroom" className="shell grid grid-cols-2 gap-2.5 py-16 sm:gap-4 lg:grid-cols-12 lg:gap-5 lg:py-24">
        <div className="lg:col-span-4">
          <Img id="editorial-pressing-1" alt="Striped sets being pressed by hand" sizes="(min-width: 1024px) 32vw, 48vw" />
        </div>
        <div className="mt-12 lg:col-span-4 lg:mt-24">
          <Img id="editorial-pressing-2" alt="A made-to-order puff jacket laid out for pressing" sizes="(min-width: 1024px) 32vw, 48vw" />
        </div>
        <div className="col-span-2 mt-6 lg:col-span-3 lg:col-start-10 lg:mt-0 lg:self-end">
          <p className="text-[1.0625rem] leading-relaxed">
            Handmade with precision and a keen eye for detail. Thoughtfully made, beautifully finished.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/shop" className="btn btn-primary">
              Shop the collection
            </Link>
            <InstagramLink placement="about" className="btn btn-secondary">
              <InstagramIcon width={18} height={18} />
              Follow @{site.instagram.handle}
            </InstagramLink>
          </div>
        </div>
      </section>

      <StoreLocation />
    </>
  )
}

import { testimonials } from '../../data/social'
import { InstagramLink } from '../ContactLinks'
import { InstagramIcon } from '../Icons'

export function Testimonials() {
  const approved = testimonials.filter((t) => t.approved)

  return (
    <section aria-labelledby="feedback-title" className="bg-bone">
      <div className="shell py-16 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="feedback-title" className="type-h1 lg:col-span-5">
            Worn by you.
          </h2>

          {approved.length > 0 ? (
            <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-7">
              {approved.map((t, i) => (
                <li key={i} className="border-t border-taupe/50 pt-5">
                  <blockquote>
                    <p className="text-[1.125rem] leading-relaxed">“{t.quote}”</p>
                    <footer className="mt-3 text-sm text-stone">
                      {t.name}
                      {t.source ? `, via ${t.source}` : ''}
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          ) : (
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-[1.0625rem] leading-relaxed">
                Messages and photos from our customers live in the Feedback highlight on our Instagram. Have a look at
                what people say after their pieces arrive.
              </p>
              <InstagramLink placement="feedback" className="btn btn-secondary mt-7">
                <InstagramIcon width={18} height={18} />
                Read client feedback
              </InstagramLink>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

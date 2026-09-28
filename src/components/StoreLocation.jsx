import { site } from '../config/site'
import { DirectionsLink, InstagramLink, WhatsAppLink } from './ContactLinks'
import { InstagramIcon, MapPinIcon, WhatsAppIcon } from './Icons'

/** Physical-store block. Opening hours only show once SNUG confirms them (PRD §10.12). */
export function StoreLocation({ headingLevel: H = 'h2', title = 'Find us in Nairobi CBD' }) {
  const { address, openingHours } = site

  return (
    <section aria-labelledby="store-title" className="border-t border-line">
      <div className="shell grid gap-10 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-5">
          <H id="store-title" className="type-h1">
            {title}
          </H>
          <div className="mt-6 max-w-sm text-[0.9375rem] text-stone">
            {openingHours?.length ? (
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                {openingHours.map((row) => (
                  <div key={row.days} className="contents">
                    <dt>{row.days}</dt>
                    <dd className="text-ink">{row.hours}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p>Planning a visit? Message us on WhatsApp first and we’ll confirm we’re in.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <address className="not-italic" style={{ fontStretch: '108%' }}>
            <span className="block text-[1.5rem] leading-tight sm:text-[1.875rem]">{address.building}</span>
            <span className="block text-[1.5rem] leading-tight sm:text-[1.875rem]">{address.street}</span>
            <span className="mt-3 block text-[1.0625rem] text-stone" style={{ fontStretch: '100%' }}>
              {address.unit}, {address.city}, {address.country}
            </span>
          </address>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <DirectionsLink placement="store" className="btn btn-primary">
              <MapPinIcon width={18} height={18} />
              Get directions
            </DirectionsLink>
            <WhatsAppLink placement="store" className="btn btn-secondary">
              <WhatsAppIcon width={18} height={18} />
              WhatsApp us
            </WhatsAppLink>
            <InstagramLink placement="store" className="btn btn-secondary">
              <InstagramIcon width={18} height={18} />
              Instagram
            </InstagramLink>
          </div>
        </div>
      </div>
    </section>
  )
}

import { DirectionsLink, InstagramLink, WhatsAppLink } from '../components/ContactLinks'
import { InstagramIcon, MapPinIcon, WhatsAppIcon } from '../components/Icons'
import { site } from '../config/site'
import { storeJsonLd, useSeo } from '../lib/seo'

export default function Contact() {
  useSeo({
    title: 'Contact',
    description: `Message ${site.brandName} on WhatsApp or Instagram, or visit us at ${site.address.building}, ${site.address.street}, ${site.address.city}.`,
    path: '/contact',
    jsonLd: storeJsonLd(),
  })

  const { address, openingHours, phone, email } = site
  const row = 'grid gap-4 border-t border-line py-8 md:grid-cols-12 md:gap-10'
  const label = 'text-stone md:col-span-3'

  return (
    <div className="shell pb-24 pt-10 lg:pb-28 lg:pt-16">
      <h1 className="type-display max-w-4xl">Talk to us.</h1>
      <p className="mt-6 max-w-lg text-[1.125rem] leading-relaxed text-stone">
        WhatsApp is the quickest way to reach us, whether you’re ordering, asking about a size or planning a visit.
      </p>

      <div className="mt-14 lg:mt-20">
        <div className={row}>
          <h2 className={label}>WhatsApp</h2>
          <div className="md:col-span-9">
            <p className="max-w-md">Orders, sizing, availability and delivery questions.</p>
            <WhatsAppLink placement="contact" className="btn btn-primary mt-5">
              <WhatsAppIcon width={18} height={18} />
              Message us on WhatsApp
            </WhatsAppLink>
          </div>
        </div>

        <div className={row}>
          <h2 className={label}>Instagram</h2>
          <div className="md:col-span-9">
            <p className="max-w-md">New drops, styling and client feedback. Send us a DM any time.</p>
            <InstagramLink placement="contact" className="btn btn-secondary mt-5">
              <InstagramIcon width={18} height={18} />@{site.instagram.handle}
            </InstagramLink>
          </div>
        </div>

        <div className={row}>
          <h2 className={label}>Visit</h2>
          <div className="md:col-span-9">
            <address className="not-italic text-[1.25rem] leading-snug" style={{ fontStretch: '106%' }}>
              {address.building}
              <br />
              {address.street}, {address.unit}
              <br />
              {address.city}, {address.country}
            </address>
            <DirectionsLink placement="contact" className="btn btn-secondary mt-5">
              <MapPinIcon width={18} height={18} />
              Get directions
            </DirectionsLink>
          </div>
        </div>

        <div className={row}>
          <h2 className={label}>Opening hours</h2>
          <div className="md:col-span-9">
            {openingHours?.length ? (
              <dl className="grid max-w-sm grid-cols-[auto_1fr] gap-x-8 gap-y-1">
                {openingHours.map((r) => (
                  <div key={r.days} className="contents">
                    <dt className="text-stone">{r.days}</dt>
                    <dd>{r.hours}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="max-w-md">Message us on WhatsApp before you visit and we’ll confirm we’re in.</p>
            )}
          </div>
        </div>

        {(phone || email) && (
          <div className={row}>
            <h2 className={label}>Other ways</h2>
            <div className="space-y-1 md:col-span-9">
              {phone && (
                <p>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="link">
                    {phone}
                  </a>
                </p>
              )}
              {email && (
                <p>
                  <a href={`mailto:${email}`} className="link">
                    {email}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { WhatsAppLink } from '../components/ContactLinks'
import { WhatsAppIcon } from '../components/Icons'
import { site } from '../config/site'
import { useSeo } from '../lib/seo'

const STEPS = [
  { title: 'Browse the collection', body: 'Find a piece you love in the shop.' },
  { title: 'Choose your piece', body: 'Open it to see every photo, the price and what it comes in.' },
  { title: 'Pick your options', body: 'Select your colour, size and quantity where they apply.' },
  { title: 'Tap Order on WhatsApp', body: 'We open WhatsApp with a message that already names the piece and your choices.' },
  { title: 'Confirm with us', body: 'We reply to confirm availability, payment and delivery before anything is final.' },
]

// Policies come from site.policies. Null means SNUG has not confirmed it yet: show a prompt, never an invented policy.
const POLICY_SECTIONS = [
  { key: 'delivery', title: 'Delivery' },
  { key: 'collection', title: 'Collecting in Nairobi' },
  { key: 'payment', title: 'Payment' },
  { key: 'exchangesAndReturns', title: 'Exchanges & returns' },
]

export default function Orders() {
  useSeo({
    title: 'How to order',
    description: `How ordering works at ${site.brandName}: choose your piece, select your options and confirm on WhatsApp.`,
    path: '/shipping-and-orders',
  })

  return (
    <div className="shell pb-24 pt-10 lg:pb-28 lg:pt-16">
      <h1 className="type-display max-w-4xl">How ordering works.</h1>
      <p className="mt-6 max-w-lg text-[1.125rem] leading-relaxed text-stone">
        There’s no checkout here. Every order is a conversation with us on WhatsApp, so you can ask anything before you
        pay.
      </p>

      <ol className="mt-14 grid gap-x-10 gap-y-10 border-t border-line pt-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <li key={step.title}>
            <p className="text-[2.5rem] font-light leading-none text-taupe tabular-nums" style={{ fontStretch: '112%' }} aria-hidden="true">
              {i + 1}
            </p>
            <h2 className="type-h3 mt-4">{step.title}</h2>
            <p className="mt-2 text-stone">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link to="/shop" className="btn btn-primary">
          Start browsing
        </Link>
        <WhatsAppLink placement="orders" className="btn btn-secondary">
          <WhatsAppIcon width={18} height={18} />
          Ask us a question
        </WhatsAppLink>
      </div>

      <section aria-labelledby="made-to-order" className="mt-20 grid gap-4 border-t border-line pt-10 md:grid-cols-12 md:gap-10 lg:mt-28">
        <h2 id="made-to-order" className="type-h2 md:col-span-4">
          Made on order
        </h2>
        <p className="max-w-xl text-[1.0625rem] leading-relaxed md:col-span-7 md:col-start-6">
          Some pieces, like our club puff jackets, the Kenya Cosy Jersey and the Snug &amp; Go grey set, are made on order
          in your size. We’ll share timing when you order.
        </p>
      </section>

      <section aria-labelledby="policies-title" className="mt-20 lg:mt-28">
        <h2 id="policies-title" className="type-h2">
          Delivery, payment and returns
        </h2>
        <dl className="mt-8 border-t border-line">
          {POLICY_SECTIONS.map(({ key, title }) => (
            <div key={key} className="grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-10">
              <dt className="font-medium md:col-span-4">{title}</dt>
              <dd className="max-w-xl text-stone md:col-span-7 md:col-start-6">
                {site.policies[key] || (
                  <>
                    We confirm this with you on WhatsApp before you pay.{' '}
                    <WhatsAppLink placement={`policy-${key}`} className="link text-ink">
                      Ask us
                    </WhatsAppLink>
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

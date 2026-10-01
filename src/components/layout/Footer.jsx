import { Link } from 'react-router-dom'
import { site } from '../../config/site'
import { DirectionsLink, InstagramLink, WhatsAppLink } from '../ContactLinks'
import { Wordmark } from '../Wordmark'

export function Footer() {
  const year = new Date().getFullYear()
  const heading = 'text-sm text-on-bar/60'
  const list = 'mt-3 space-y-2 text-[0.9375rem]'
  const link = 'transition-colors hover:text-bone-deep hover:underline underline-offset-4'

  return (
    <footer className="bg-bar text-on-bar">
      <div className="shell grid gap-10 pb-10 pt-14 md:grid-cols-12 md:gap-8 lg:pt-20">
        <div className="md:col-span-5 lg:col-span-4">
          <Link to="/" className="text-[2rem]" aria-label="Snug & Co. home">
            <Wordmark inverse />
          </Link>
          <p className="mt-4 max-w-xs text-on-bar/75">{site.tagline}</p>
          <p className="mt-1 text-sm text-on-bar/50">Est. {site.established}</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 lg:col-span-5">
          <div>
            <h2 className={heading}>Shop</h2>
            <ul className={list}>
              <li>
                <Link to="/shop/new" className={link}>
                  New arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop" className={link}>
                  Shop all
                </Link>
              </li>
              <li>
                <Link to="/#collections" className={link}>
                  Collections
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={heading}>Information</h2>
            <ul className={list}>
              <li>
                <Link to="/about" className={link}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/shipping-and-orders" className={link}>
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/contact" className={link}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={heading}>Social</h2>
            <ul className={list}>
              <li>
                <InstagramLink placement="footer" className={link}>
                  Instagram
                </InstagramLink>
              </li>
              <li>
                <WhatsAppLink placement="footer" className={link}>
                  WhatsApp
                </WhatsAppLink>
              </li>
            </ul>
          </div>
        </nav>

        <div className="md:col-span-12 lg:col-span-3">
          <h2 className={heading}>Location</h2>
          <address className="mt-3 not-italic leading-relaxed text-on-bar/85">
            {site.address.building}
            <br />
            {site.address.street}, {site.address.unit}
            <br />
            {site.address.city}, {site.address.country}
          </address>
          <DirectionsLink placement="footer" className={`${link} mt-3 inline-block text-[0.9375rem]`}>
            Get directions
          </DirectionsLink>
        </div>
      </div>

      <div className="shell">
        <div className="flex flex-col gap-2 border-t border-on-bar/15 py-6 text-[0.8125rem] text-on-bar/55 sm:flex-row sm:justify-between">
          <p>
            © {year} {site.brandName} All rights reserved.
          </p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  )
}

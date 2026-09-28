/**
 * Central business configuration.
 *
 * Every component reads brand, contact and policy details from here.
 * Never hardcode these values inside components.
 *
 * Values marked PLACEHOLDER are not published anywhere by SNUG & Co.
 * and must be confirmed with the client before launch (PRD §55–56).
 * Source for everything else: the @snug_co_ke Instagram profile and posts.
 */

const address = {
  building: 'Mwalimu Sacco Building',
  street: 'Tom Mboya Street',
  unit: '7th Floor, Room No. 4',
  area: 'Nairobi CBD',
  city: 'Nairobi',
  country: 'Kenya',
  // PLACEHOLDER: address is taken from the Instagram bio; confirm before deployment.
  confirmed: false,
}

export const site = {
  brandName: 'Snug & Co.',
  shortName: 'Snug & Co',
  tagline: 'Minimal, Luxurious & Effortlessly you.',
  statement: 'Where comfort meets elevated living.',
  // Instagram bio, lightly edited for punctuation.
  bio: 'Where comfort meets elevated living. Our carefully curated pieces wrap you in softness and warmth.',
  // "EST. 2023" appears on SNUG's own product graphics.
  established: 2023,
  values: ['Effortless comfort', 'Timeless style', 'Made with intention'],
  signOff: 'Comfort. Poise. Elegance.',

  // Public URL of the deployed site, used for canonical and Open Graph tags.
  // Falls back to the current origin when not set.
  siteUrl: import.meta.env.VITE_SITE_URL || '',

  whatsapp: {
    // PLACEHOLDER: SNUG's WhatsApp business number is not published on Instagram.
    // Set it here or through VITE_WHATSAPP_NUMBER, in international format without "+" (e.g. 2547XXXXXXXX).
    number: import.meta.env.VITE_WHATSAPP_NUMBER || '',
    generalMessage: 'Hi Snug & Co., I have a question.',
  },

  instagram: {
    handle: 'snug_co_ke',
    url: 'https://www.instagram.com/snug_co_ke/',
  },

  // PLACEHOLDER: optional contact channels. Leave null to hide them.
  phone: null,
  email: null,

  address,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address.building}, ${address.street}, ${address.city}, ${address.country}`,
  )}`,

  // PLACEHOLDER: opening hours are not published. Use an array like
  // [{ days: 'Monday – Saturday', hours: '9:00 – 18:00' }] once confirmed.
  openingHours: null,

  announcement: {
    text: 'New in: the Kenya collection',
    href: '/shop?collection=kenya',
  },

  // PLACEHOLDER: business policies must come from SNUG. Null renders an
  // "ask us on WhatsApp" prompt instead of an invented policy.
  policies: {
    delivery: null,
    collection: null,
    payment: null,
    exchangesAndReturns: null,
  },
}

export const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New arrivals', to: '/shop/new' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

/**
 * Provider-agnostic analytics (PRD §47–48).
 *
 * Events are pushed to window.dataLayer (Google Tag Manager / GA4 compatible)
 * and dispatched as a DOM event so Cloudflare, Vercel or any other provider
 * can subscribe without touching components. No provider is installed yet.
 */
export const EVENTS = {
  productViewed: 'product_viewed',
  categoryViewed: 'category_viewed',
  whatsappClicked: 'whatsapp_clicked',
  whatsappOrderClicked: 'whatsapp_order_clicked',
  instagramClicked: 'instagram_clicked',
  directionsClicked: 'directions_clicked',
  searchPerformed: 'search_performed',
  shopCtaClicked: 'shop_cta_clicked',
  collectionClicked: 'collection_clicked',
}

export function track(event, properties = {}) {
  if (typeof window === 'undefined') return
  const payload = { event, ...properties }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
  window.dispatchEvent(new CustomEvent('snug:analytics', { detail: payload }))
  if (import.meta.env.DEV) console.debug('[analytics]', payload)
}

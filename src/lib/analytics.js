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
  wishlistToggled: 'wishlist_toggled',
  addedToCart: 'added_to_cart',
  whatsappCartOrderClicked: 'whatsapp_cart_order_clicked',
}

export function track(event, properties = {}) {
  if (typeof window === 'undefined') return
  const payload = { event, ...properties }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
  window.dispatchEvent(new CustomEvent('snug:analytics', { detail: payload }))
  if (import.meta.env.DEV) console.debug('[analytics]', payload)
}

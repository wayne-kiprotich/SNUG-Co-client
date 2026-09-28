const kes = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 })

export function formatPrice(amount) {
  if (amount == null) return 'Price on request'
  return `KSh ${kes.format(amount)}`
}

export const AVAILABILITY_LABEL = {
  available: 'Available to order',
  'low-stock': 'Low stock',
  'sold-out': 'Sold out',
  'coming-soon': 'Coming soon',
}

export const BADGE_LABEL = {
  new: 'New',
  bestseller: 'Bestseller',
  limited: 'Limited',
  'sold-out': 'Sold out',
}

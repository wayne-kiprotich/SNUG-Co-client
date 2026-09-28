import { site } from '../config/site'
import { formatPrice } from './format'

const number = site.whatsapp.number.replace(/\D/g, '')

export const whatsappConfigured = number.length > 0

if (!whatsappConfigured && import.meta.env.DEV) {
  console.warn(
    '[Snug & Co.] WhatsApp number is not set. Links open WhatsApp without a recipient. Set VITE_WHATSAPP_NUMBER or site.whatsapp.number.',
  )
}

/** Build a wa.me link. Without a configured number WhatsApp asks the customer to pick a chat. */
export function whatsappLink(message) {
  const text = encodeURIComponent(message)
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`
}

export function generalInquiryLink() {
  return whatsappLink(site.whatsapp.generalMessage)
}

/**
 * Structured order message (PRD §8, step 6). Only selections that apply to the
 * product are included, so staff can identify the piece without follow-up questions.
 */
export function orderMessage({ product, selection, productUrl }) {
  const lines = [`Hi ${site.brandName}, I'd like to order the ${product.name}.`, '']

  if (product.colors?.length) lines.push(`Colour: ${selection.color}`)
  if (product.sizes?.length) lines.push(`Size: ${selection.size}`)
  else lines.push('Size: I’ll share my size here')
  for (const option of product.options ?? []) {
    const value = selection.options?.[option.name]
    if (value) lines.push(`${option.name}: ${value}`)
  }
  lines.push(`Quantity: ${selection.quantity}`)
  lines.push(product.priceKES != null ? `Price: ${formatPrice(product.priceKES)}` : 'Price: please confirm')
  lines.push('', 'Is it available?')
  if (productUrl) lines.push(productUrl)

  return lines.join('\n')
}

export function restockMessage({ product, productUrl }) {
  return [`Hi ${site.brandName}, is the ${product.name} coming back?`, productUrl].filter(Boolean).join('\n')
}

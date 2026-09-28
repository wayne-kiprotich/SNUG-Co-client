import { useEffect } from 'react'
import { site } from '../config/site'

export function siteOrigin() {
  return (site.siteUrl || window.location.origin).replace(/\/$/, '')
}

export function absoluteUrl(path = '/') {
  return `${siteOrigin()}${path.startsWith('/') ? path : `/${path}`}`
}

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data) {
  const id = 'page-jsonld'
  document.getElementById(id)?.remove()
  if (!data) return
  const el = document.createElement('script')
  el.type = 'application/ld+json'
  el.id = id
  el.textContent = JSON.stringify(data)
  document.head.appendChild(el)
}

/**
 * Per-page title, description, canonical, Open Graph, X/Twitter and JSON-LD.
 * `image` is a site-relative path; defaults to the brand share image.
 */
export function useSeo({ title, description, path, image, type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} | ${site.brandName}` : `${site.brandName} | ${site.tagline}`
  const desc = description || site.bio
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const url = absoluteUrl(path ?? window.location.pathname)
    const img = absoluteUrl(image || '/og-default.jpg')
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setCanonical(url)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)
    setJsonLd(jsonLdKey ? JSON.parse(jsonLdKey) : null)
  }, [fullTitle, desc, path, image, type, jsonLdKey])
}

/** schema.org ClothingStore built only from confirmed configuration. */
export function storeJsonLd() {
  const { address } = site
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: site.brandName,
    slogan: site.tagline,
    url: siteOrigin(),
    logo: absoluteUrl('/images/logo-320.webp'),
    image: absoluteUrl('/og-default.jpg'),
    sameAs: [site.instagram.url],
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.building}, ${address.street}, ${address.unit}`,
      addressLocality: address.city,
      addressCountry: 'KE',
    },
  }
  if (site.phone) data.telephone = site.phone
  if (site.email) data.email = site.email
  return data
}

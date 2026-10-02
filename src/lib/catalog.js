import { registerImages } from './images'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

// Each page loads only its own data (index.html starts that request before the app runs):
//   home     /home             new arrivals, category tiles, His & Hers
//   listing  /products         card-sized data for every piece (shop, search, menu, bag, wishlist)
//   product  /products/<slug>  one piece in full, plus related pieces
// Results are kept for the visit, so going back to a page is instant.

export class NotFoundError extends Error {}

const store = new Map()
// Card-sized data seen so far, by slug: a product page can show its photo, name and price at once.
const previews = new Map()

function remember(products) {
  for (const p of products) if (!previews.has(p.slug)) previews.set(p.slug, p)
  return products
}

function load(key, fetcher) {
  let entry = store.get(key)
  if (!entry) {
    entry = { data: null, error: null }
    entry.promise = fetcher().then(
      (data) => (entry.data = data),
      (error) => {
        entry.error = error
        throw error
      },
    )
    store.set(key, entry)
  }
  return entry.promise
}

/** { data, error } once a load has settled, else undefined. */
export function peek(key) {
  const entry = store.get(key)
  return entry && (entry.data || entry.error) ? entry : undefined
}

export function forget(key) {
  store.delete(key)
}

async function getJson(path) {
  const res = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' } })
  if (res.status === 404) throw new NotFoundError('Not found')
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  const data = await res.json()
  registerImages(data.images)
  return data
}

const bySort = (a, b) => a.sortOrder - b.sortOrder

// No API (local preview only): the bundled catalog, loaded on demand so it never ships in the main bundle.
let local = null
function localCatalog() {
  local ??= Promise.all([import('../data/products'), import('../data/categories')]).then(([p, c]) => ({
    products: [...p.products].sort(bySort),
    categories: [...c.categories].sort(bySort),
    collections: [...c.collections],
  }))
  return local
}

export const listingKey = 'listing'
export const homeKey = 'home'
export const productKey = (slug) => `product:${slug}`

export function loadListing() {
  return load(listingKey, async () => {
    const data = API_URL ? await getJson('/products') : await localCatalog()
    return {
      products: remember([...data.products].sort(bySort)),
      categories: [...data.categories].sort(bySort),
      collections: data.collections,
    }
  })
}

export function loadHome() {
  return load(homeKey, async () => {
    if (API_URL) {
      const data = await getJson('/home')
      remember(data.newArrivals)
      remember(data.hisAndHers)
      return data
    }
    const { products, categories } = await localCatalog()
    const counts = {}
    for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1
    return {
      newArrivals: products.filter((p) => p.newArrival).slice(0, 4),
      hisAndHers: products.filter((p) => p.collections.includes('his-and-hers') && p.images.length).slice(0, 2),
      categories: categories.filter((c) => counts[c.slug]).map((c) => ({ ...c, productCount: counts[c.slug] })),
    }
  })
}

export function loadProduct(slug) {
  return load(productKey(slug), async () => {
    if (API_URL) {
      const data = await getJson(`/products/${encodeURIComponent(slug)}`)
      remember(data.related)
      return data
    }
    const catalog = await localCatalog()
    const product = catalog.products.find((p) => p.slug === slug)
    if (!product) throw new NotFoundError('Not found')
    return {
      product,
      category: catalog.categories.find((c) => c.slug === product.category),
      related: relatedProducts(catalog.products, product),
    }
  })
}

/** Start loading a product page's data ahead of a likely tap. */
export function prefetchProduct(slug) {
  loadProduct(slug).catch(() => {})
}

/** Card-sized data for a product already seen on another page, or undefined. */
export function productPreview(slug) {
  return previews.get(slug)
}

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

export function sortProducts(list, sort = 'featured') {
  const items = [...list]
  const price = (p, fallback) => (p.priceKES == null ? fallback : p.priceKES)
  switch (sort) {
    case 'newest':
      return items.sort((a, b) => a.recency - b.recency)
    case 'price-asc':
      return items.sort((a, b) => price(a, Infinity) - price(b, Infinity) || a.sortOrder - b.sortOrder)
    case 'price-desc':
      return items.sort((a, b) => price(b, -Infinity) - price(a, -Infinity) || a.sortOrder - b.sortOrder)
    default:
      return items.sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder)
  }
}

export function filterProducts(list, { category, collection, newOnly } = {}) {
  return list.filter(
    (p) =>
      (!category || p.category === category) &&
      (!collection || p.collections.includes(collection)) &&
      (!newOnly || p.newArrival),
  )
}

const normalise = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')

export function searchProducts(catalog, query) {
  const terms = normalise(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  const categoryName = Object.fromEntries(catalog.categories.map((c) => [c.slug, c.name]))
  const collectionName = Object.fromEntries(catalog.collections.map((c) => [c.slug, c.name]))

  return catalog.products
    .map((p) => {
      const fields = {
        name: normalise(p.name),
        meta: normalise(
          [categoryName[p.category], ...p.collections.map((c) => collectionName[c]), ...p.tags].join(' '),
        ),
        description: normalise(p.description),
      }
      let score = 0
      for (const term of terms) {
        if (fields.name.includes(term)) score += 3
        else if (fields.meta.includes(term)) score += 2
        else if (fields.description.includes(term)) score += 1
        else return null
      }
      return { product: p, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.product.sortOrder - b.product.sortOrder)
    .map((r) => r.product)
}

// Same scoring as the API's related_to(); used only without an API.
function relatedProducts(products, product, limit = 4) {
  const score = (p) =>
    (p.collections.some((c) => product.collections.includes(c)) ? 2 : 0) + (p.category === product.category ? 1 : 0)
  return products
    .filter((p) => p.id !== product.id)
    .map((p) => ({ p, s: score(p) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.p.sortOrder - b.p.sortOrder)
    .slice(0, limit)
    .map((r) => r.p)
}

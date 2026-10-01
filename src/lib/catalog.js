import { products as localProducts } from '../data/products'
import { categories as localCategories, collections as localCollections } from '../data/categories'
import { registerImages } from './images'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

let cache = null

async function fetchCatalog() {
  const res = await fetch(`${API_URL}/catalog`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Catalog request failed (${res.status})`)
  const data = await res.json()
  registerImages(data.images)
  return { products: data.products, categories: data.categories, collections: data.collections }
}

export async function loadCatalog() {
  if (cache) return cache
  const bySort = (a, b) => a.sortOrder - b.sortOrder
  const source = API_URL
    ? await fetchCatalog()
    : { products: localProducts, categories: localCategories, collections: localCollections }
  cache = {
    products: [...source.products].sort(bySort),
    categories: [...source.categories].sort(bySort),
    collections: [...source.collections],
  }
  return cache
}

export function getCachedCatalog() {
  return cache
}

export function resetCatalogCache() {
  cache = null
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

export function relatedProducts(catalog, product, limit = 4) {
  const others = catalog.products.filter((p) => p.id !== product.id)
  const score = (p) =>
    (p.collections.some((c) => product.collections.includes(c)) ? 2 : 0) + (p.category === product.category ? 1 : 0)
  return others
    .map((p) => ({ p, s: score(p) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.p.sortOrder - b.p.sortOrder)
    .slice(0, limit)
    .map((r) => r.p)
}

// Writes the storefront's bundled catalog to ../server/seed/catalog.json so the
// admin database can start with the same products. Run: npm run export-catalog
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { categories, collections } from '../src/data/categories.js'
import { products } from '../src/data/products.js'

const root = dirname(fileURLToPath(import.meta.url))
const out = resolve(root, '../../server/seed/catalog.json')

const byOrder = (a, b) => a.sortOrder - b.sortOrder
const data = {
  categories: [...categories].sort(byOrder),
  collections,
  products: [...products].sort(byOrder),
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(data, null, 2) + '\n')
console.log(`Wrote ${data.products.length} products, ${data.categories.length} categories, ${data.collections.length} collections to ${out}`)

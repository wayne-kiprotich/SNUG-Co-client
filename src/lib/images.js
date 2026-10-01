import manifest from '../data/image-manifest.json'

const uploaded = new Map()

export function registerImages(images) {
  for (const [id, meta] of Object.entries(images || {})) uploaded.set(id, meta)
}

export function getImage(id) {
  if (!id) return null
  const up = uploaded.get(id)
  if (up) return { widths: up.widths, width: up.width, height: up.height, url: (w) => `${up.base}-${w}.webp` }
  const bundled = manifest[id]
  if (bundled) {
    return { widths: bundled.widths, width: bundled.width, height: bundled.height, url: (w) => `/images/${id}-${w}.webp` }
  }
  return null
}

export function srcSetFor(image) {
  return image.widths.map((w) => `${image.url(w)} ${w}w`).join(', ')
}

export function imageSrc(id, width) {
  const image = getImage(id)
  if (!image) return null
  return image.url(width && image.widths.includes(width) ? width : image.widths.at(-1))
}

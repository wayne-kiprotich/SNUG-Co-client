import { useState } from 'react'
import { fallbackSrc, getImage, imageSrc, srcSetFor } from '../lib/images'
import { Wordmark } from './Wordmark'

export { imageSrc }

// priority: the main above-the-fold photo (loads first). eager: visible at load, normal priority.
// Everything else loads lazily as it scrolls into view. ladder: see LADDERS in lib/images.
export function Img({
  id,
  alt,
  sizes = '100vw',
  ladder = 'card',
  priority = false,
  eager = false,
  className = '',
  imgClassName = '',
  ratio = '4 / 5',
}) {
  const image = getImage(id)
  // Remembered per photo, so a newer photo in the same spot (fresh site settings) gets its chance.
  const [failedId, setFailedId] = useState(null)
  const failed = failedId === id
  // Lazy images fade in.
  const [loaded, setLoaded] = useState(priority || eager)

  return (
    <div className={`relative overflow-hidden bg-bone ${className}`} style={{ aspectRatio: ratio }}>
      {image && !failed ? (
        <img
          src={fallbackSrc(image, ladder)}
          srcSet={srcSetFor(image, ladder)}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={alt}
          loading={priority || eager ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          ref={(el) => el?.complete && el.naturalWidth && setLoaded(true)}
          onLoad={() => setLoaded(true)}
          onError={() => setFailedId(id)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      ) : (
        <ImageFallback label={alt} />
      )}
    </div>
  )
}

export function ImageFallback({ label }) {
  return (
    <div role="img" aria-label={label || 'Image unavailable'} className="absolute inset-0 grid place-items-center bg-bone text-taupe">
      <Wordmark className="text-lg" decorative />
    </div>
  )
}

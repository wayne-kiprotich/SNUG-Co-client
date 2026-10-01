import { useState } from 'react'
import { getImage, imageSrc, srcSetFor } from '../lib/images'
import { Wordmark } from './Wordmark'

export { imageSrc }

export function Img({ id, alt, sizes = '100vw', priority = false, className = '', imgClassName = '', ratio = '4 / 5' }) {
  const image = getImage(id)
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-bone ${className}`} style={{ aspectRatio: ratio }}>
      {image && !failed ? (
        <img
          src={image.url(image.widths.at(-1))}
          srcSet={srcSetFor(image)}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding={priority ? 'sync' : 'async'}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
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
      <Wordmark className="text-lg" />
    </div>
  )
}

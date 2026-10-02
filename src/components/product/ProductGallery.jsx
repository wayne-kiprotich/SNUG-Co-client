import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { Img } from '../Img'

export function ProductGallery({ product }) {
  const desktop = useMediaQuery('(min-width: 1024px)')
  if (product.images.length === 0) return <Img id={null} alt={product.name} priority />
  return desktop ? <GalleryStack images={product.images} /> : <GalleryCarousel images={product.images} name={product.name} />
}

function GalleryStack({ images }) {
  const oddLead = images.length % 2 === 1
  return (
    <ul className="grid grid-cols-2 gap-2">
      {images.map((img, i) => {
        const wide = i === 0 && oddLead
        return (
          <li key={img.id} className={wide ? 'col-span-2' : ''}>
            <Img id={img.id} alt={img.alt} sizes={wide ? '56vw' : '28vw'} ladder="large" priority={i === 0} />
          </li>
        )
      })}
    </ul>
  )
}

function GalleryCarousel({ images, name }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track || images.length < 2) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setIndex(Number(entry.target.dataset.index))
        }
      },
      { root: track, threshold: 0.6 },
    )
    track.querySelectorAll('[data-index]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [images])

  const scrollTo = (i) => {
    const track = trackRef.current
    track?.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        aria-label={`${name} photos`}
      >
        {images.map((img, i) => (
          <li key={img.id} data-index={i} className="w-full shrink-0 snap-center md:w-1/2">
            <Img id={img.id} alt={img.alt} sizes="(min-width: 768px) 50vw, 100vw" ladder="large" priority={i === 0} />
          </li>
        ))}
      </ul>
      {images.length > 1 && (
        <>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center md:hidden">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => scrollTo(i)}
                className="grid h-11 w-7 place-items-center"
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-current={i === index ? 'true' : undefined}
              >
                <span className={`block h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-ink' : 'w-1.5 bg-ink/35'}`} />
              </button>
            ))}
          </div>
          <p className="absolute right-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-xs tabular-nums md:hidden" aria-hidden="true">
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  )
}

import { site } from '../config/site'
import { instagramGallery } from '../data/social'
import { InstagramLink } from './ContactLinks'
import { Img } from './Img'

export function SocialGallery() {
  return (
    <section aria-labelledby="gallery-title" className="shell py-16 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="gallery-title" className="type-h2">
          Follow @{site.instagram.handle}
        </h2>
        <InstagramLink placement="gallery-heading" className="link pb-1 text-[0.9375rem]">
          Open Instagram
        </InstagramLink>
      </div>
      <ul className="mt-8 grid grid-cols-4 gap-1 sm:gap-2 lg:grid-cols-8">
        {instagramGallery.map((item) => (
          <li key={item.href}>
            <InstagramLink href={item.href} placement="gallery" className="group block" aria-label={`${item.alt}, view on Instagram`}>
              <Img
                id={item.image}
                alt=""
                sizes="(min-width: 1024px) 12vw, 25vw"
                ladder="small"
                imgClassName="transition-opacity duration-300 group-hover:opacity-85"
              />
            </InstagramLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

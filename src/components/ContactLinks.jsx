import { site } from '../config/site'
import { EVENTS, track } from '../lib/analytics'
import { generalInquiryLink } from '../lib/whatsapp'

function External({ href, children, onClick, ...props }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} {...props}>
      {children}
    </a>
  )
}

export function WhatsAppLink({ children, placement, ...props }) {
  return (
    <External
      href={generalInquiryLink()}
      onClick={() => track(EVENTS.whatsappClicked, { placement })}
      {...props}
    >
      {children}
    </External>
  )
}

export function InstagramLink({ children, placement, href = site.instagram.url, ...props }) {
  return (
    <External href={href} onClick={() => track(EVENTS.instagramClicked, { placement })} {...props}>
      {children}
    </External>
  )
}

export function DirectionsLink({ children, placement, ...props }) {
  return (
    <External href={site.mapsUrl} onClick={() => track(EVENTS.directionsClicked, { placement })} {...props}>
      {children}
    </External>
  )
}

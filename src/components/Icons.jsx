const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h18M3 12h18M3 17h12" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </svg>
  )
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function MinusIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  )
}

export function ChevronIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function FilterIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  )
}

export function InstagramIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function WhatsAppIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 19.5l1.1-3.9A8 8 0 1 1 8.6 18.6z" />
      <path
        d="M9.3 8.6c.2-.4.5-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .4-.1.6l-.4.5c-.1.2-.1.4 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5-.1l.5-.6c.2-.2.4-.2.6-.1l1.4.7c.2.1.3.3.3.5v.4c0 .3-.1.6-.4.8-.5.4-1.2.6-1.9.4-2.6-.7-4.6-2.7-5.3-5.3-.2-.6 0-1.3.3-1.7z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  )
}

export function MapPinIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  )
}

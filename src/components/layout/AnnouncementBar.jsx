import { Link } from 'react-router-dom'
import { useSettings } from '../../lib/settings'

export function AnnouncementBar() {
  const settings = useSettings()
  const text = settings?.announcementText
  const href = settings?.announcementHref

  if (!text) return null
  const isInternal = href?.startsWith('/')
  return (
    <div className="bg-bar text-on-bar">
      <div className="shell flex min-h-9 items-center justify-center py-2 text-center text-[0.8125rem] tracking-[0.01em]">
        {isInternal ? (
          <Link to={href} className="link">
            {text}
          </Link>
        ) : href ? (
          <a href={href} className="link">
            {text}
          </a>
        ) : (
          <p>{text}</p>
        )}
      </div>
    </div>
  )
}

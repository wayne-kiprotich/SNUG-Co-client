import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadSettings } from '../../lib/settings'

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null)

  useEffect(() => {
    let active = true
    loadSettings()
      .then((settings) => {
        if (active) setAnnouncement({ text: settings.announcementText, href: settings.announcementHref })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  if (!announcement?.text) return null
  const isInternal = announcement.href?.startsWith('/')
  return (
    <div className="bg-bar text-on-bar">
      <div className="shell flex min-h-9 items-center justify-center py-2 text-center text-[0.8125rem] tracking-[0.01em]">
        {isInternal ? (
          <Link to={announcement.href} className="link">
            {announcement.text}
          </Link>
        ) : announcement.href ? (
          <a href={announcement.href} className="link">
            {announcement.text}
          </a>
        ) : (
          <p>{announcement.text}</p>
        )}
      </div>
    </div>
  )
}

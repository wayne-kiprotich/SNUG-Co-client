import { Link } from 'react-router-dom'
import { site } from '../../config/site'

export function AnnouncementBar() {
  const { announcement } = site
  if (!announcement?.text) return null
  return (
    <div className="bg-ink text-paper">
      <div className="shell flex min-h-9 items-center justify-center py-2 text-center text-[0.8125rem] tracking-[0.01em]">
        {announcement.href ? (
          <Link to={announcement.href} className="link">
            {announcement.text}
          </Link>
        ) : (
          <p>{announcement.text}</p>
        )}
      </div>
    </div>
  )
}

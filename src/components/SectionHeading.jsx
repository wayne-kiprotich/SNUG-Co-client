import { Link } from 'react-router-dom'

export function SectionHeading({ title, subtitle, link, id, as: Tag = 'h2' }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="max-w-2xl">
        <Tag id={id} className="type-h2">
          {title}
        </Tag>
        {subtitle && <p className="mt-2 text-stone">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link.to} className="link tap shrink-0 pb-1 text-[0.9375rem]" onClick={link.onClick}>
          {link.label}
        </Link>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import { WhatsAppLink } from './ContactLinks'

export function EmptyState({ title, body, actions }) {
  return (
    <div className="border-y border-line py-14 lg:py-20">
      <p className="type-h3">{title}</p>
      {body && <p className="mt-2 max-w-md text-stone">{body}</p>}
      {actions && <div className="mt-6 flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function CatalogError({ onRetry }) {
  return (
    <div role="alert" className="border-y border-line py-14 lg:py-20">
      <p className="type-h3">The collection didn’t load.</p>
      <p className="mt-2 max-w-md text-stone">
        Check your connection and try again. You can still order any piece you’ve seen on our Instagram through WhatsApp.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
        <WhatsAppLink placement="catalog-error" className="btn btn-secondary">
          Message us on WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  )
}

export function ShopAllLink({ className = 'btn btn-primary' }) {
  return (
    <Link to="/shop" className={className}>
      Explore the full collection
    </Link>
  )
}

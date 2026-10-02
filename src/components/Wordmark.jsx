export function Wordmark({ className = '', inverse = false, decorative = false }) {
  const img = (
    <img
      src="/snug-logo.svg"
      alt={decorative ? '' : undefined}
      aria-hidden={decorative || undefined}
      className={`snug-logo h-[1em] w-auto align-middle ${inverse ? 'invert' : ''} ${className}`}
    />
  )
  if (decorative) return img
  return (
    <span role="img" aria-label="Snug & Co." className="inline-flex">
      {img}
    </span>
  )
}

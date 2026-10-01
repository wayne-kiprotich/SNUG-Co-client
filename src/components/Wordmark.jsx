export function Wordmark({ className = '', inverse = false }) {
  return (
    <span
      className={`inline-flex items-baseline gap-[0.22em] whitespace-nowrap font-light tracking-[-0.02em] ${className}`}
      style={{ fontStretch: '104%' }}
    >
      <span>Snug</span>
      <span className="font-extrabold" style={{ color: inverse ? 'var(--color-taupe)' : 'var(--color-espresso)' }}>
        &amp;
      </span>
      <span>Co.</span>
    </span>
  )
}

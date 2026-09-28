import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'

export const inputClass =
  'block h-11 w-full rounded-[2px] border border-line bg-paper px-3 text-base outline-none placeholder:text-stone/60 focus:border-ink aria-[invalid=true]:border-alert'
export const textareaClass =
  'block w-full rounded-[2px] border border-line bg-paper px-3 py-2.5 text-base leading-relaxed outline-none placeholder:text-stone/60 focus:border-ink aria-[invalid=true]:border-alert'
export const smallButton =
  'inline-flex min-h-9 items-center justify-center rounded-[2px] border border-line px-3 text-sm transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40'

/** Label, control and message in one place. `children` receives the props the control needs. */
export function Field({ label, error, hint, children, className = '' }) {
  const id = useId()
  const describedBy = [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm">
        {label}
      </label>
      {children({ id, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[0.8125rem] font-medium text-alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Check({ label, hint, checked, onChange, disabled }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 py-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-1 size-5 shrink-0 accent-ink"
      />
      <span className="text-[0.9375rem] leading-snug">
        {label}
        {hint && <span className="mt-0.5 block text-[0.8125rem] text-stone">{hint}</span>}
      </span>
    </label>
  )
}

/** Two-step delete: the first press asks, the second confirms. Resets after a few seconds. */
export function ConfirmButton({ children, confirmLabel = 'Press again to confirm', onConfirm, className = '', disabled }) {
  const [armed, setArmed] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (!armed) {
          setArmed(true)
          timer.current = setTimeout(() => setArmed(false), 4000)
        } else {
          clearTimeout(timer.current)
          setArmed(false)
          onConfirm()
        }
      }}
      className={`${smallButton} ${armed ? 'border-alert bg-alert text-paper hover:border-alert' : 'text-alert hover:border-alert'} ${className}`}
    >
      {armed ? confirmLabel : children}
    </button>
  )
}

const ToastContext = createContext(() => {})
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const notify = useCallback((message, tone = 'ok') => {
    clearTimeout(timer.current)
    setToast({ message, tone, key: Date.now() })
    timer.current = setTimeout(() => setToast(null), tone === 'error' ? 7000 : 3500)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:bottom-6">
        {toast && (
          <p
            key={toast.key}
            className={`pointer-events-auto max-w-md rounded-[2px] px-4 py-3 text-[0.9375rem] shadow-lg ${
              toast.tone === 'error' ? 'bg-alert text-paper' : 'bg-ink text-paper'
            }`}
          >
            {toast.message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function PageTitle({ title, children }) {
  useEffect(() => {
    document.title = `${title} | Snug & Co. admin`
  }, [title])
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <h1 className="type-h1">{title}</h1>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

export function Spinner({ label = 'Loading…' }) {
  return (
    <p role="status" className="py-16 text-stone">
      {label}
    </p>
  )
}

export function ErrorNotice({ error, onRetry }) {
  return (
    <div role="alert" className="border-y border-line py-10">
      <p className="type-h3">Couldn’t load this.</p>
      <p className="mt-1 max-w-md text-stone">{error?.message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-secondary mt-5">
          Try again
        </button>
      )}
    </div>
  )
}

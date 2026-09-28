import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Wordmark } from '../components/Wordmark'
import { api } from './api'
import { useNoIndex } from './AdminLayout'
import { Field, inputClass } from './ui'

export function Component() {
  useNoIndex()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Sign in | Snug & Co. admin'
    // Already signed in? Go straight to the admin.
    api.me().then(() => navigate('/admin', { replace: true })).catch(() => {})
  }, [navigate])

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await api.login(email, password)
      const from = location.state?.from
      navigate(from && from.startsWith('/admin') && from !== '/admin/login' ? from : '/admin', { replace: true })
    } catch (err) {
      setError(err.message)
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-svh place-items-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-sm" noValidate>
        <p className="text-[2rem]">
          <Wordmark />
        </p>
        <h1 className="type-h2 mt-8">Sign in</h1>
        <p className="mt-2 text-stone">For the Snug &amp; Co. team only.</p>

        {error && (
          <p role="alert" className="mt-6 border-l-2 border-alert pl-4 text-[0.9375rem] font-medium text-alert">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-5">
          <Field label="Email">
            {(props) => (
              <input
                {...props}
                type="email"
                autoComplete="username"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            )}
          </Field>
          <Field label="Password">
            {(props) => (
              <input
                {...props}
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <button type="submit" disabled={busy || !email || !password} className="btn btn-primary mt-8 w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

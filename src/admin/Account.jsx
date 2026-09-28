import { useState } from 'react'
import { api } from './api'
import { Field, PageTitle, inputClass, useToast } from './ui'

export function Component() {
  const notify = useToast()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    if (next !== confirm) {
      setErrors({ confirm: 'The two new passwords don’t match.' })
      return
    }
    setBusy(true)
    setErrors({})
    try {
      await api.changePassword(current, next)
      setCurrent('')
      setNext('')
      setConfirm('')
      notify('Password changed')
    } catch (err) {
      setErrors({ currentPassword: err.fields?.currentPassword, newPassword: err.fields?.newPassword })
      if (!err.fields || !Object.keys(err.fields).length) notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageTitle title="Account" />
      <form onSubmit={submit} className="mt-8 max-w-sm space-y-5" noValidate>
        <h2 className="type-h3">Change password</h2>
        <Field label="Current password" error={errors.currentPassword}>
          {(field) => <input {...field} type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass} />}
        </Field>
        <Field label="New password" error={errors.newPassword} hint="At least 12 characters. A few random words works well.">
          {(field) => <input {...field} type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={inputClass} />}
        </Field>
        <Field label="Repeat new password" error={errors.confirm}>
          {(field) => <input {...field} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />}
        </Field>
        <button type="submit" className="btn btn-primary" disabled={busy || !current || !next || !confirm}>
          {busy ? 'Saving…' : 'Change password'}
        </button>
      </form>
    </>
  )
}

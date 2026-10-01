import { useEffect, useState } from 'react'
import { api } from './api'
import { Field, PageTitle, Spinner, inputClass, useToast } from './ui'

export function Component() {
  const notify = useToast()
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [href, setHref] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    api
      .settings()
      .then(({ settings }) => {
        if (!active) return
        setText(settings.announcementText || '')
        setHref(settings.announcementHref || '')
      })
      .catch((err) => active && notify(err.message, 'error'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setErrors({})
    try {
      await api.updateSettings({ announcementText: text || null, announcementHref: href || null })
      notify('Announcement bar updated')
    } catch (err) {
      setErrors(err.fields || {})
      if (!err.fields || !Object.keys(err.fields).length) notify(err.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="shell">
        <Spinner label="Loading settings…" />
      </div>
    )
  }

  return (
    <>
      <PageTitle title="Settings" />
      <form onSubmit={submit} className="mt-8 max-w-sm space-y-5" noValidate>
        <h2 className="type-h3">Announcement bar</h2>
        <Field label="Text" error={errors.announcementText} hint="Shown in the strip at the top of every page. Leave empty to hide it.">
          {(field) => <input {...field} type="text" maxLength={200} value={text} onChange={(e) => setText(e.target.value)} className={inputClass} />}
        </Field>
        <Field label="Link" error={errors.announcementHref} hint="Where the announcement points, e.g. /shop?collection=kenya. Leave empty for plain text.">
          {(field) => <input {...field} type="text" value={href} onChange={(e) => setHref(e.target.value)} className={inputClass} />}
        </Field>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
      </form>
    </>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { useDialog } from '../hooks/useDialog'
import { Img } from '../components/Img'
import { CloseIcon } from '../components/Icons'
import { api } from './api'
import { ConfirmButton, ErrorNotice, Field, PageTitle, Spinner, inputClass, smallButton, textareaClass, useToast } from './ui'

const COPY = {
  categories: {
    title: 'Categories',
    singular: 'category',
    intro: 'Every product belongs to exactly one category. They appear in the shop filters, the menu and “Shop by category” on the home page, in this order.',
    empty: 'Nothing here yet. Add a category before adding products.',
    deleteHint: 'A category can only be deleted once it has no products.',
  },
  collections: {
    title: 'Collections',
    singular: 'collection',
    intro: 'Themed groups such as the Kenya collection. A product can be in several. They appear as filters in the shop.',
    empty: 'No collections yet.',
    deleteHint: 'Deleting a collection only removes the group. Its products stay in the shop.',
  },
}

function CoverPicker({ open, onClose, onPick, current }) {
  const ref = useDialog(open, onClose)
  const [state, setState] = useState({ status: 'loading', images: [] })

  useEffect(() => {
    if (!open) return
    setState({ status: 'loading', images: [] })
    api
      .allImages()
      .then((data) => setState({ status: 'ready', images: data.images }))
      .catch(() => setState({ status: 'error', images: [] }))
  }, [open])

  return (
    <dialog ref={ref} className="drawer drawer-bottom" aria-label="Choose a cover photo">
      <div className="flex max-h-[88dvh] flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <p className="font-medium">Choose a cover photo</p>
          <button type="button" onClick={onClose} className="-mr-2.5 grid size-11 place-items-center rounded-full hover:bg-bone" aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          {state.status === 'loading' && <Spinner />}
          {state.status === 'error' && <p role="alert">Couldn’t load the photos.</p>}
          {state.status === 'ready' && (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
              {state.images.map((image) => (
                <li key={image.id}>
                  <button
                    type="button"
                    onClick={() => onPick(image.id)}
                    className={`block w-full border-2 ${current === image.id ? 'border-ink' : 'border-transparent hover:border-taupe'}`}
                    aria-label={`${image.product}: ${image.alt}`}
                    aria-pressed={current === image.id}
                  >
                    <Img id={image.id} alt="" sizes="120px" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </dialog>
  )
}

function Row({ kind, item, index, count, onSaved, onDeleted, onMove }) {
  const notify = useToast()
  const copy = COPY[kind]
  const [form, setForm] = useState({ name: item.name, slug: item.slug, description: item.description, image: item.image })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [picking, setPicking] = useState(false)
  const closePicker = useCallback(() => setPicking(false), [])

  // Follow the server after a move or reload.
  useEffect(() => {
    setForm({ name: item.name, slug: item.slug, description: item.description, image: item.image })
  }, [item])

  const dirty = form.name !== item.name || form.slug !== item.slug || form.description !== item.description || form.image !== item.image
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const save = async (event) => {
    event.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const { item: saved } = await api.updateTaxonomy(kind, item.id, { ...form, image: form.image || null })
      onSaved(saved)
      notify(`${saved.name} saved`)
    } catch (err) {
      setErrors(err.fields || {})
      notify(err.fields && Object.keys(err.fields).length ? 'Fix the highlighted field and save again.' : err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    try {
      await api.deleteTaxonomy(kind, item.id)
      onDeleted(item)
      notify(`${item.name} deleted`)
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <li className="border-b border-line py-6">
      <form onSubmit={save} noValidate className="grid gap-5 lg:grid-cols-[8rem_1fr] lg:gap-8">
        <div>
          <div className="w-28 lg:w-full">
            <Img id={form.image} alt="" sizes="128px" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className={smallButton} onClick={() => setPicking(true)}>
              {form.image ? 'Change photo' : 'Choose photo'}
            </button>
            {form.image && (
              <button type="button" className={smallButton} onClick={() => set('image', null)}>
                Remove
              </button>
            )}
          </div>
          {errors.image && (
            <p role="alert" className="mt-1 text-[0.8125rem] font-medium text-alert">
              {errors.image}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              {(field) => <input {...field} type="text" value={form.name} maxLength={80} onChange={(e) => set('name', e.target.value)} className={inputClass} />}
            </Field>
            <Field label="Web address" error={errors.slug} hint={`/shop/…`}>
              {(field) => <input {...field} type="text" value={form.slug} maxLength={80} onChange={(e) => set('slug', e.target.value)} className={inputClass} />}
            </Field>
          </div>
          <Field label="Short description" error={errors.description}>
            {(field) => (
              <textarea {...field} rows={2} maxLength={300} value={form.description} onChange={(e) => set('description', e.target.value)} className={textareaClass} />
            )}
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" disabled={!dirty || saving} className="btn btn-primary min-h-10 px-5">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className={smallButton} disabled={index === 0} onClick={() => onMove(item, 'up')} aria-label={`Move ${item.name} earlier`}>
              ↑
            </button>
            <button type="button" className={smallButton} disabled={index === count - 1} onClick={() => onMove(item, 'down')} aria-label={`Move ${item.name} later`}>
              ↓
            </button>
            <span className="text-sm text-stone">
              {item.productCount} {item.productCount === 1 ? 'product' : 'products'}
            </span>
            <ConfirmButton className="ml-auto" confirmLabel="Press again to delete" onConfirm={remove}>
              Delete
            </ConfirmButton>
          </div>
          <p className="text-[0.8125rem] text-stone">{copy.deleteHint}</p>
        </div>
      </form>
      <CoverPicker
        open={picking}
        onClose={closePicker}
        current={form.image}
        onPick={(id) => {
          set('image', id)
          setPicking(false)
        }}
      />
    </li>
  )
}

function AddForm({ kind, onAdded }) {
  const notify = useToast()
  const copy = COPY[kind]
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const { item } = await api.createTaxonomy(kind, { name, description })
      onAdded(item)
      setName('')
      setDescription('')
      notify(`${item.name} added. Choose a cover photo for it below.`)
    } catch (err) {
      setErrors(err.fields || {})
      if (!err.fields || !Object.keys(err.fields).length) notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8 grid gap-4 border border-line p-4 sm:grid-cols-[1fr_1.5fr_auto] sm:items-end">
      <Field label={`New ${copy.singular} name`} error={errors.name || errors.slug}>
        {(field) => <input {...field} type="text" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className={inputClass} />}
      </Field>
      <Field label="Short description (optional)" error={errors.description}>
        {(field) => <input {...field} type="text" value={description} maxLength={300} onChange={(e) => setDescription(e.target.value)} className={inputClass} />}
      </Field>
      <button type="submit" className="btn btn-primary" disabled={saving || !name.trim()}>
        {saving ? 'Adding…' : `Add ${copy.singular}`}
      </button>
    </form>
  )
}

function TaxonomyPage({ kind }) {
  const copy = COPY[kind]
  const [state, setState] = useState({ status: 'loading', items: [], error: null })

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading' }))
    api
      .taxonomy(kind)
      .then((data) => setState({ status: 'ready', items: data.items, error: null }))
      .catch((error) => setState({ status: 'error', items: [], error }))
  }, [kind])
  useEffect(load, [load])

  const replace = (saved) => setState((s) => ({ ...s, items: s.items.map((i) => (i.id === saved.id ? { ...i, ...saved } : i)) }))
  const move = async (item, direction) => {
    try {
      await api.moveTaxonomy(kind, item.id, direction)
      const data = await api.taxonomy(kind)
      setState((s) => ({ ...s, items: data.items }))
    } catch {
      load()
    }
  }

  return (
    <>
      <PageTitle title={copy.title} />
      <p className="mt-3 max-w-xl text-stone">{copy.intro}</p>

      {state.status === 'loading' && <Spinner />}
      {state.status === 'error' && (
        <div className="mt-8">
          <ErrorNotice error={state.error} onRetry={load} />
        </div>
      )}
      {state.status === 'ready' && (
        <>
          <AddForm kind={kind} onAdded={(item) => setState((s) => ({ ...s, items: [...s.items, item] }))} />
          {state.items.length === 0 ? (
            <p className="mt-8 border-y border-line py-10 text-stone">{copy.empty}</p>
          ) : (
            <ul className="mt-6 border-t border-line">
              {state.items.map((item, index) => (
                <Row
                  key={item.id}
                  kind={kind}
                  item={item}
                  index={index}
                  count={state.items.length}
                  onSaved={replace}
                  onDeleted={(gone) => setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== gone.id) }))}
                  onMove={move}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  )
}

export const Categories = () => <TaxonomyPage kind="categories" />
export const Collections = () => <TaxonomyPage kind="collections" />

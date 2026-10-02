import { useRef, useState } from 'react'
import { Img } from '../components/Img'
import { api } from './api'
import { ConfirmButton, inputClass, smallButton, useToast } from './ui'

const FOCUS = [
  { value: 0.15, label: 'Top (faces and hats)' },
  { value: 0.4, label: 'Upper body' },
  { value: 0.5, label: 'Centre' },
  { value: 0.75, label: 'Lower (shoes and trousers)' },
]

export function ImageManager({ productId, images, onChange }) {
  const notify = useToast()
  const fileInput = useRef(null)
  const [focus, setFocus] = useState(0.4)
  const [busy, setBusy] = useState(false)
  const [alts, setAlts] = useState({})

  const run = async (task, success) => {
    setBusy(true)
    try {
      const { product } = await task()
      onChange(product)
      if (success) notify(success)
      return true
    } catch (err) {
      notify(err.message, 'error')
      return false
    } finally {
      setBusy(false)
    }
  }

  const upload = async (event) => {
    const files = [...event.target.files]
    if (!files.length) return
    await run(() => api.uploadImages(productId, files, focus), files.length === 1 ? 'Photo added' : `${files.length} photos added`)
    if (fileInput.current) fileInput.current.value = ''
  }

  const move = (index, delta) => {
    const ids = images.map((i) => i.id)
    const target = index + delta
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    run(() => api.orderImages(productId, ids), 'Order saved')
  }

  const saveAlt = (image) => {
    const alt = (alts[image.id] ?? image.alt).trim()
    if (!alt || alt === image.alt) return
    run(() => api.updateImage(productId, image.id, alt), 'Description saved')
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor="photo-upload" className="mb-1.5 block text-sm">
            Add photos
          </label>
          <input
            ref={fileInput}
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={busy || images.length >= 12}
            onChange={upload}
            className="block w-full text-sm file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-[2px] file:border file:border-ink file:bg-paper file:px-4 file:text-sm hover:file:bg-bone"
          />
          <p className="mt-1.5 text-[0.8125rem] text-stone">
            JPEG, PNG or WebP, at least 600px wide, up to 10 MB each. Portrait photos work best. {images.length} of 12 used.
          </p>
        </div>
        <div>
          <label htmlFor="photo-focus" className="mb-1.5 block text-sm">
            Crop around
          </label>
          <select id="photo-focus" value={focus} onChange={(e) => setFocus(Number(e.target.value))} className={`${inputClass} sm:w-56`}>
            {FOCUS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {busy && (
        <p role="status" className="mt-4 text-sm text-stone">
          Working…
        </p>
      )}

      {images.length === 0 ? (
        <p className="mt-6 border-y border-line py-8 text-stone">No photos yet. The shop shows a plain placeholder until you add one.</p>
      ) : (
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <li key={image.id} className="border border-line p-3">
              <Img id={image.id} alt={image.alt} sizes="(min-width: 1024px) 22vw, 45vw" />
              <p className="mt-3 text-[0.8125rem] text-stone">{index === 0 ? 'Main photo (shown on shop cards)' : `Photo ${index + 1}`}</p>
              <label className="sr-only" htmlFor={`alt-${image.id}`}>
                Description of photo {index + 1}
              </label>
              <input
                id={`alt-${image.id}`}
                type="text"
                value={alts[image.id] ?? image.alt}
                maxLength={300}
                onChange={(e) => setAlts((a) => ({ ...a, [image.id]: e.target.value }))}
                onBlur={() => saveAlt(image)}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                placeholder="Describe the photo for screen readers"
                className={`${inputClass} mt-1 h-10 text-sm`}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" className={smallButton} disabled={busy || index === 0} onClick={() => move(index, -1)} aria-label={`Move photo ${index + 1} earlier`}>
                  ←
                </button>
                <button type="button" className={smallButton} disabled={busy || index === images.length - 1} onClick={() => move(index, 1)} aria-label={`Move photo ${index + 1} later`}>
                  →
                </button>
                <ConfirmButton
                  disabled={busy}
                  confirmLabel="Confirm remove"
                  onConfirm={() => run(() => api.deleteImage(productId, image.id), 'Photo removed')}
                  className="ml-auto"
                >
                  Remove
                </ConfirmButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

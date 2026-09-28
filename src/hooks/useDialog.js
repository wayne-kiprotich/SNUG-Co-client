import { useEffect, useRef } from 'react'

/**
 * Drives a native <dialog> as a modal: focus trapping, Escape to close and
 * inert background come from the platform. Clicking the backdrop also closes.
 */
export function useDialog(open, onClose) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
    if (!open) document.documentElement.style.overflow = ''
  }, [open])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const handleClose = () => {
      document.documentElement.style.overflow = ''
      onClose()
    }
    const handleClick = (event) => {
      if (event.target === dialog) dialog.close()
    }
    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('click', handleClick)
    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('click', handleClick)
    }
  }, [onClose])

  return ref
}

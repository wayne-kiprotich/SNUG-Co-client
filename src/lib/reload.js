const KEY = 'snug-chunk-reload'

export function isChunkError(error) {
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported/i.test(
    String(error?.message ?? error),
  )
}

export function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0)
    if (Date.now() - last < 15000) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
  }
  window.location.reload()
  return true
}

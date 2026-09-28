/**
 * After a new deploy, a tab that was already open asks for script files that no longer
 * exist. Reloading once fetches the new build. The timestamp stops a reload loop when the
 * server is genuinely down.
 */
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
    // Storage blocked: reload anyway, once, since we can't record it.
  }
  window.location.reload()
  return true
}

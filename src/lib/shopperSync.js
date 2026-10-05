// When a tab should ask the server for the bag and wishlist again. No browser APIs here, so
// `npm test` can run it under Node.

// Returning to a tab (focus, or the tab becoming visible) asks again at most this often. A
// change made in another tab arrives at once through the storage event instead.
export const FRESH_FOR = 10_000

/**
 * True when returning to the tab should refresh the shopper state. Nothing is fetched on a visit
 * that never loaded or never saved anything, so visitors who don't shop don't hit the API.
 */
export function shouldRefreshOnReturn({ now, loadedAt, ready, error, hasItems }) {
  if (now - loadedAt < FRESH_FOR) return false
  if (error) return true
  return ready && hasItems
}

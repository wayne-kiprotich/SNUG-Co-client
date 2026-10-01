import { site } from '../config/site'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

let cache = null

async function fetchSettings() {
  const res = await fetch(`${API_URL}/settings`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Settings request failed (${res.status})`)
  return res.json()
}

export async function loadSettings() {
  if (cache) return cache
  cache = API_URL
    ? await fetchSettings()
    : { announcementText: site.announcement?.text || null, announcementHref: site.announcement?.href || null }
  return cache
}

export function resetSettingsCache() {
  cache = null
}

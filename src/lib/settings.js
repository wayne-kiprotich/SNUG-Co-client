import { useEffect, useState } from 'react'
import { site } from '../config/site'
import { registerImages } from './images'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

// Used until the admin picks its own photos, and when there is no backend.
export const DEFAULT_VISUALS = {
  heroImage: 'colour-block-short-set-2',
  heroAlt: 'Two models in Snug & Co. sets: a brown and cream short set and a black trouser set',
  featureImage: 'kenya-bomber-jacket-1',
  featureImageSmall: 'kenya-cosy-jersey-1',
}

let cache = null

async function fetchSettings() {
  const res = await fetch(`${API_URL}/settings`, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Settings request failed (${res.status})`)
  const data = await res.json()
  registerImages(data.images)
  return data
}

function withDefaults(data) {
  const out = { ...data }
  for (const [key, value] of Object.entries(DEFAULT_VISUALS)) out[key] = data[key] || value
  return out
}

export async function loadSettings() {
  if (cache) return cache
  cache = withDefaults(
    API_URL
      ? await fetchSettings().catch(() => ({}))
      : { announcementText: site.announcement?.text || null, announcementHref: site.announcement?.href || null },
  )
  return cache
}

export function resetSettingsCache() {
  cache = null
}

/** Site settings, or null while they load. */
export function useSettings() {
  const [settings, setSettings] = useState(cache)
  useEffect(() => {
    if (cache) return
    let active = true
    loadSettings().then((s) => active && setSettings(s))
    return () => {
      active = false
    }
  }, [])
  return settings
}

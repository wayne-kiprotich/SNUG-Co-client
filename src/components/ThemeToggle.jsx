import { useState } from 'react'
import { MoonIcon, SunIcon } from './Icons'

// New key: earlier visits that followed the system's dark mode start on the cream theme again.
const KEY = 'snug-theme-choice'

// label: show the words beside the icon (menu and footer); the header used to show the icon alone.
export function ThemeToggle({ className = '', label = false }) {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')

  function toggle() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#241a12' : '#faf6f0')
    try {
      localStorage.setItem(KEY, next)
    } catch {
    }
    setDark(!dark)
  }

  return (
    <button type="button" className={className} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
      {dark ? <SunIcon /> : <MoonIcon />}
      {label && (dark ? 'Light mode' : 'Dark mode')}
    </button>
  )
}

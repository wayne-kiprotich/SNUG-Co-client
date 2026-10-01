import { useState } from 'react'
import { MoonIcon, SunIcon } from './Icons'

const KEY = 'snug-theme'

export function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')

  function toggle() {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#232425' : '#ffffff')
    try {
      localStorage.setItem(KEY, next)
    } catch {
    }
    setDark(!dark)
  }

  return (
    <button type="button" className={className} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggle}>
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

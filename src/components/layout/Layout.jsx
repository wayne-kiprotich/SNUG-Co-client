import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { ShopperNotice } from '../ShopperNotice'
import { AnnouncementBar } from './AnnouncementBar'
import { Footer } from './Footer'
import { Header } from './Header'

function HashScroller() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }))
  }, [hash, pathname])
  return null
}

export function Layout() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <ShopperNotice />
      <ScrollRestoration getKey={(loc) => (loc.key === 'default' ? loc.pathname + loc.search : loc.key)} />
      <HashScroller />
    </>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigation } from '../../config/site'
import { WhatsAppLink } from '../ContactLinks'
import { cartCount, shopperEnabled, useShopper } from '../../lib/shopper'
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, WhatsAppIcon } from '../Icons'
import { Wordmark } from '../Wordmark'
import { MobileMenu } from './MobileMenu'
import { SearchDialog } from './SearchDialog'

function isNavActive(to, pathname) {
  if (to === '/') return pathname === '/'
  if (to === '/shop') return (pathname.startsWith('/shop') && pathname !== '/shop/new') || pathname.startsWith('/product/')
  return pathname === to
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const { wishlist, cart } = useShopper()
  const bagCount = cartCount(cart)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  const iconButton =
    'grid size-11 place-items-center rounded-full transition-colors hover:bg-bone focus-visible:bg-bone'

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-[background-color,border-color] duration-300 ${
          scrolled ? 'border-b border-line bg-paper/95' : 'border-b border-transparent bg-paper'
        }`}
      >
        <div className="shell grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[4.5rem] lg:grid-cols-[auto_1fr_auto] lg:gap-12">
          <div className="flex items-center lg:hidden">
            <button type="button" className={`${iconButton} -ml-2.5`} aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </button>
            <button type="button" className={iconButton} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>
          </div>

          <Link to="/" className="inline-flex items-center justify-self-center text-[2.25rem] lg:justify-self-start lg:text-[2.75rem]" aria-label="Snug & Co. home">
            <Wordmark />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.9375rem]">
              {navigation.map((item) => {
                const active = isNavActive(item.to, location.pathname)
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={`py-2 transition-colors hover:text-espresso ${
                        active ? 'underline decoration-1 underline-offset-[0.5em]' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end">
            <button type="button" className={`${iconButton} hidden lg:grid`} aria-label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </button>
            {shopperEnabled && (
              <>
                <Link to="/wishlist" className={`${iconButton} relative`} aria-label={`Wishlist, ${wishlist.length} saved`}>
                  <HeartIcon />
                  <CountBadge count={wishlist.length} />
                </Link>
                <Link
                  to="/cart"
                  className={`${iconButton} relative -mr-2.5 lg:mr-0`}
                  aria-label={`Bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
                >
                  <BagIcon />
                  <CountBadge count={bagCount} />
                </Link>
              </>
            )}
            <WhatsAppLink placement="header" className="btn btn-primary ml-4 hidden min-h-10 px-4 lg:inline-flex">
              <WhatsAppIcon width={18} height={18} />
              WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  )
}

function CountBadge({ count }) {
  if (!count) return null
  return (
    <span
      aria-hidden="true"
      className="absolute right-0.5 top-0.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-ink px-1 text-[0.6875rem] font-medium leading-none text-paper tabular-nums"
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

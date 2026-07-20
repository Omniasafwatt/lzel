import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setCartDrawer, setSearchOpen, setMobileMenu } from '@/features/ui/store/uiSlice'
import { logout } from '@/features/auth/store/authSlice'
import { getInitials } from '@/lib/utils'
import { useGetCategoriesQuery } from '@/data/useMockData'
import { Logo } from '@/components/common/Logo'

type Scheme = 'light' | 'dark' | 'orange'

const SCHEME_COLORS = {
  light: {
    navText:    '#555',
    navActive:  '#D4693A',
    icon:       '#666',
    logoFilter: 'none',
    signInBg:   '#2d3444',
    signInText: '#ffffff',
    barColor:   '#D4693A',
    dotColor:   '#D4693A',
  },
  dark: {
    navText:    'rgba(255,255,255,0.55)',
    navActive:  '#ffffff',
    icon:       'rgba(255,255,255,0.65)',
    logoFilter: 'brightness(0) invert(1)',
    signInBg:   'rgba(255,255,255,0.15)',
    signInText: '#ffffff',
    barColor:   '#D4693A',
    dotColor:   '#ffffff',
  },
  orange: {
    navText:    'rgba(255,255,255,0.80)',
    navActive:  '#ffffff',
    icon:       'rgba(255,255,255,0.85)',
    logoFilter: 'brightness(0) invert(1)',
    signInBg:   '#2d3444',
    signInText: '#ffffff',
    barColor:   '#ffffff',
    dotColor:   '#ffffff',
  },
}

const NAV = [
  { label: 'Shop', href: '/products' },
  { label: 'Gaming', href: '/categories/gaming' },
  { label: 'Accessories', href: '/categories/accessories' },
  { label: 'Appliances', href: '/categories/appliances' },
  { label: 'Smart Home', href: '/categories/smart-home' },
]

function NavItem({
  label, href, active, colors,
}: {
  label: string; href: string; active: boolean
  colors: typeof SCHEME_COLORS['light']
}) {
  const [hovered, setHovered] = useState(false)
  const letters = label.split('')

  return (
    <Link
      to={href}
      className="relative flex flex-col items-center px-4 py-2 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="flex overflow-hidden">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block text-[11px] font-black uppercase tracking-[0.18em]"
            animate={
              hovered
                ? { y: 0, color: colors.navActive, rotate: i % 2 === 0 ? -8 : 8, scale: 1.2 }
                : { y: 0, color: active ? colors.navActive : colors.navText, rotate: 0, scale: 1 }
            }
            transition={{
              delay: hovered ? i * 0.045 : (letters.length - 1 - i) * 0.03,
              type: 'spring',
              stiffness: 600,
              damping: 14,
            }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        ))}
      </span>

      <motion.span
        className="absolute bottom-0 left-0 h-[2px] rounded-full"
        style={{ background: colors.barColor }}
        initial={{ width: 0, left: '50%' }}
        animate={hovered ? { width: '100%', left: '0%' } : { width: 0, left: '50%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />

      {active && !hovered && (
        <motion.span
          layoutId="nav-dot"
          className="absolute -bottom-0.5 size-1 rounded-full"
          style={{ background: colors.dotColor }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  )
}

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAppSelector((s) => s.auth)
  const cartCount = useAppSelector((s) =>
    s.cart.cart?.items.filter((i) => !i.savedForLater).reduce((a, i) => a + i.quantity, 0) ?? 0
  )
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length)
  const mobileOpen = useAppSelector((s) => s.ui.mobileMenuOpen)
  const [scheme, setScheme] = useState<Scheme>('light')
  const [userMenu, setUserMenu] = useState(false)

  useGetCategoriesQuery()

  useEffect(() => {
    const detect = () => {
      const el = document.elementFromPoint(window.innerWidth / 2, 34)
      let cur: Element | null = el
      while (cur) {
        const s = cur.getAttribute('data-nav-scheme')
        if (s) { setScheme(s as Scheme); return }
        cur = cur.parentElement
      }
      setScheme('light')
    }
    detect()
    window.addEventListener('scroll', detect, { passive: true })
    return () => window.removeEventListener('scroll', detect)
  }, [])

  const colors = SCHEME_COLORS[scheme]
  const handleLogout = () => { dispatch(logout()); setUserMenu(false); navigate('/') }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div style={{ filter: colors.logoFilter, transition: 'filter 0.4s ease' }}>
                <Logo size="sm" />
              </div>
            </Link>

            {/* Center nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((item) => {
                const active = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                return <NavItem key={item.href} label={item.label} href={item.href} active={active} colors={colors} />
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => dispatch(setSearchOpen(true))}
                style={{ color: colors.icon, transition: 'color 0.3s' }}
                className="flex size-9 items-center justify-center rounded-lg"
              >
                <Search className="size-4" />
              </button>

              <Link
                to="/wishlist"
                style={{ color: colors.icon, transition: 'color 0.3s' }}
                className="relative flex size-9 items-center justify-center rounded-lg"
              >
                <Heart className="size-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#D4693A] text-[9px] font-bold text-white">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => dispatch(setCartDrawer(true))}
                style={{ color: colors.icon, transition: 'color 0.3s' }}
                className="relative flex size-9 items-center justify-center rounded-lg"
              >
                <ShoppingCart className="size-4" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#D4693A] text-[9px] font-bold text-white"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>

              {isAuthenticated && user ? (
                <div className="relative ml-1">
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex size-9 items-center justify-center rounded-lg bg-[#D4693A]/10 text-xs font-bold text-[#D4693A] hover:bg-[#D4693A]/20 transition-all"
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </button>
                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white border border-[#E8E4DF] overflow-hidden shadow-xl"
                        onMouseLeave={() => setUserMenu(false)}
                      >
                        <div className="p-4 border-b border-[#F0EDE9]">
                          <p className="font-semibold text-[#2d3444] text-sm">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-[#999] truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-2">
                          {['admin', 'vendor'].includes(user.role) && (
                            <Link to="/admin" onClick={() => setUserMenu(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-[#555] hover:text-[#2d3444] hover:bg-[#F7F3EE] rounded-lg transition-colors">
                              <LayoutDashboard className="size-4" /> Admin
                            </Link>
                          )}
                          <Link to="/account" onClick={() => setUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-[#555] hover:text-[#2d3444] hover:bg-[#F7F3EE] rounded-lg transition-colors">
                            <User className="size-4" /> My Account
                          </Link>
                          <button onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <LogOut className="size-4" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  style={{
                    background: colors.signInBg,
                    color: colors.signInText,
                    transition: 'background 0.4s, color 0.4s',
                  }}
                  className="ml-2 rounded-full px-5 py-2 text-xs font-bold"
                >
                  Sign In
                </Link>
              )}

              <button
                style={{ color: colors.icon, transition: 'color 0.3s' }}
                className="ml-1 flex size-9 items-center justify-center rounded-lg md:hidden"
                onClick={() => dispatch(setMobileMenu(!mobileOpen))}
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 mx-3 rounded-2xl bg-white border border-[#E8E4DF] shadow-xl p-3 md:hidden"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => dispatch(setMobileMenu(false))}
                className="block px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#555] hover:text-[#D4693A] hover:bg-[#F7F3EE] rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setSearchOpen, setMobileMenu } from '@/features/ui/store/uiSlice'
import { Logo } from '@/components/common/Logo'

type Scheme = 'light' | 'dark' | 'orange'

const SCHEME_COLORS = {
  light: {
    navText:    '#555',
    navActive:  '#D4693A',
    icon:       '#666',
    logoFilter: 'none',
    barColor:   '#D4693A',
    dotColor:   '#D4693A',
  },
  dark: {
    navText:    'rgba(255,255,255,0.55)',
    navActive:  '#ffffff',
    icon:       'rgba(255,255,255,0.65)',
    logoFilter: 'brightness(0) invert(1)',
    barColor:   '#D4693A',
    dotColor:   '#ffffff',
  },
  orange: {
    navText:    'rgba(255,255,255,0.80)',
    navActive:  '#ffffff',
    icon:       'rgba(255,255,255,0.85)',
    logoFilter: 'brightness(0) invert(1)',
    barColor:   '#ffffff',
    dotColor:   '#ffffff',
  },
}

const NAV = [
  { label: 'Gaming',      href: '/categories/gaming' },
  { label: 'Accessories', href: '/categories/accessories' },
  { label: 'Appliances',  href: '/categories/appliances' },
  { label: 'Smart Home',  href: '/categories/smart-home' },
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
  const location = useLocation()
  const mobileOpen = useAppSelector((s) => s.ui.mobileMenuOpen)
  const [scheme, setScheme] = useState<Scheme>('light')

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
            <div className="flex items-center gap-1">
              <button
                onClick={() => dispatch(setSearchOpen(true))}
                style={{ color: colors.icon, transition: 'color 0.3s' }}
                className="flex size-9 items-center justify-center rounded-lg"
              >
                <Search className="size-4" />
              </button>

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

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setCartDrawer, setSearchOpen, setMobileMenu } from '@/features/ui/store/uiSlice'
import { logout } from '@/features/auth/store/authSlice'
import { useTheme } from '@/components/providers/ThemeProvider'
import { getInitials } from '@/lib/utils'
import { useGetCategoriesQuery } from '@/features/products/services/categoriesApi'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Sale', href: '/products?sale=true' },
  { label: 'Brands', href: '/brands' },
]

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { resolvedTheme, setTheme } = useTheme()
  const { isAuthenticated, user } = useAppSelector((s) => s.auth)
  const cartItemCount = useAppSelector((s) =>
    s.cart.cart?.items.filter((i) => !i.savedForLater).reduce((a, i) => a + i.quantity, 0) ?? 0
  )
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length)
  const unreadNotifications = useAppSelector((s) => s.notifications.unreadCount)
  const mobileMenuOpen = useAppSelector((s) => s.ui.mobileMenuOpen)
  const { data: categoriesData } = useGetCategoriesQuery()
  const categories = categoriesData?.data?.slice(0, 6) ?? []

  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-background'
      )}
    >
      <div className="container flex h-16 items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-2xl font-bold"
        >
          <span className="text-gradient">Lzel</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Categories mega */}
          <div className="relative" onMouseLeave={() => setCategoriesOpen(false)}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onMouseEnter={() => setCategoriesOpen(true)}
            >
              Shop <ChevronDown className={cn('size-3 transition-transform', categoriesOpen && 'rotate-180')} />
            </Button>
            <AnimatePresence>
              {categoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-64 rounded-xl border bg-popover p-3 shadow-xl"
                  onMouseEnter={() => setCategoriesOpen(true)}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/categories/${cat.slug}`}
                      className="flex items-center gap-3 rounded-lg p-2.5 text-sm font-medium hover:bg-accent transition-colors"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      {cat.image && (
                        <img src={cat.image} alt={cat.name} className="size-8 rounded-md object-cover" />
                      )}
                      <div>
                        <div>{cat.name}</div>
                        {cat.productCount != null && (
                          <div className="text-xs text-muted-foreground">{cat.productCount} products</div>
                        )}
                      </div>
                    </Link>
                  ))}
                  <div className="mt-2 border-t pt-2">
                    <Link
                      to="/products"
                      className="block rounded-lg p-2.5 text-center text-sm font-semibold text-primary hover:bg-accent transition-colors"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      View all products →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {NAV_LINKS.map((l) => (
            <Button key={l.href} variant="ghost" size="sm" asChild>
              <Link to={l.href}>{l.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setSearchOpen(true))}
            aria-label="Search"
          >
            <Search className="size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="relative"
            aria-label="Wishlist"
          >
            <Link to="/wishlist">
              <Heart className="size-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => dispatch(setCartDrawer(true))}
            aria-label="Cart"
          >
            <ShoppingCart className="size-5" />
            {cartItemCount > 0 && (
              <motion.span
                key={cartItemCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
              >
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </motion.span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={resolvedTheme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </motion.div>
            </AnimatePresence>
          </Button>

          {isAuthenticated && user ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="size-8 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
                {unreadNotifications > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border bg-popover shadow-xl"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="border-b p-3">
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      {['admin', 'vendor'].includes(user.role) && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="size-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/account"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="size-4" /> My Account
                      </Link>
                      <Link
                        to="/account/orders"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="size-4" /> Orders
                      </Link>
                      <Link
                        to="/account/notifications"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Bell className="size-4" /> Notifications
                        {unreadNotifications > 0 && (
                          <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
                            {unreadNotifications}
                          </Badge>
                        )}
                      </Link>
                      <Link
                        to="/account/security"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="size-4" /> Settings
                      </Link>
                      <div className="my-1 border-t" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="size-4" /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/auth/login">Sign in</Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => dispatch(setMobileMenu(!mobileMenuOpen))}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t md:hidden"
          >
            <nav className="container flex flex-col gap-1 py-3">
              <Link
                to="/products"
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent"
                onClick={() => dispatch(setMobileMenu(false))}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="rounded-lg px-3 py-2.5 text-sm hover:bg-accent"
                  onClick={() => dispatch(setMobileMenu(false))}
                >
                  {cat.name}
                </Link>
              ))}
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="rounded-lg px-3 py-2.5 text-sm hover:bg-accent"
                  onClick={() => dispatch(setMobileMenu(false))}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

import { Outlet, ScrollRestoration } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '@/features/cart/components/CartDrawer'
import SearchModal from '@/features/search/components/SearchModal'
import ErrorBoundary from '@/components/common/ErrorBoundary'

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <ScrollRestoration />
    </div>
  )
}

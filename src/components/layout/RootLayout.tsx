import { Outlet, ScrollRestoration } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '@/features/cart/components/CartDrawer'
import SearchModal from '@/features/search/components/SearchModal'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import CustomCursor from '@/components/common/CustomCursor'

export default function RootLayout() {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
        <Navbar />
        <main className="flex-1">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
        <CartDrawer />
        <SearchModal />
        <ScrollRestoration />
      </div>
    </SmoothScrollProvider>
  )
}

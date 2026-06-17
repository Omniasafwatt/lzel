import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import RootLayout from '@/components/layout/RootLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import AdminRoute from '@/components/common/AdminRoute'
import PageLoader from '@/components/common/PageLoader'

function Lazy(factory: () => Promise<{ default: React.ComponentType }>) {
  const Component = lazy(factory)
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  // ─── Public storefront ─────────────────────────────────────────────────────
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: Lazy(() => import('@/pages/HomePage')) },
      { path: 'products', element: Lazy(() => import('@/pages/ProductsPage')) },
      { path: 'products/:slug', element: Lazy(() => import('@/pages/ProductDetailPage')) },
      { path: 'categories/:slug', element: Lazy(() => import('@/pages/CategoryPage')) },
      { path: 'search', element: Lazy(() => import('@/pages/SearchPage')) },
      { path: 'cart', element: Lazy(() => import('@/pages/CartPage')) },
      { path: 'wishlist', element: Lazy(() => import('@/pages/WishlistPage')) },
      // Protected user routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'checkout', element: Lazy(() => import('@/pages/CheckoutPage')) },
          { path: 'checkout/confirmation/:orderId', element: Lazy(() => import('@/pages/OrderConfirmationPage')) },
          { path: 'account', element: Lazy(() => import('@/pages/account/AccountPage')) },
          { path: 'account/orders', element: Lazy(() => import('@/pages/account/OrdersPage')) },
          { path: 'account/orders/:id', element: Lazy(() => import('@/pages/account/OrderDetailPage')) },
          { path: 'account/addresses', element: Lazy(() => import('@/pages/account/AddressesPage')) },
          { path: 'account/profile', element: Lazy(() => import('@/pages/account/ProfilePage')) },
          { path: 'account/wishlist', element: Lazy(() => import('@/pages/WishlistPage')) },
          { path: 'account/notifications', element: Lazy(() => import('@/pages/account/NotificationsPage')) },
          { path: 'account/security', element: Lazy(() => import('@/pages/account/SecurityPage')) },
          { path: 'account/payment-methods', element: Lazy(() => import('@/pages/account/PaymentMethodsPage')) },
          { path: 'support', element: Lazy(() => import('@/pages/support/SupportPage')) },
          { path: 'support/tickets/:id', element: Lazy(() => import('@/pages/support/TicketPage')) },
        ],
      },
      { path: 'track/:orderNumber', element: Lazy(() => import('@/pages/TrackOrderPage')) },
      { path: 'about', element: Lazy(() => import('@/pages/static/AboutPage')) },
      { path: 'contact', element: Lazy(() => import('@/pages/static/ContactPage')) },
      { path: 'faq', element: Lazy(() => import('@/pages/static/FaqPage')) },
      { path: 'privacy', element: Lazy(() => import('@/pages/static/PrivacyPage')) },
      { path: 'terms', element: Lazy(() => import('@/pages/static/TermsPage')) },
    ],
  },
  // ─── Auth ──────────────────────────────────────────────────────────────────
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: Lazy(() => import('@/pages/auth/LoginPage')) },
      { path: 'register', element: Lazy(() => import('@/pages/auth/RegisterPage')) },
      { path: 'forgot-password', element: Lazy(() => import('@/pages/auth/ForgotPasswordPage')) },
      { path: 'reset-password', element: Lazy(() => import('@/pages/auth/ResetPasswordPage')) },
      { path: 'verify-email', element: Lazy(() => import('@/pages/auth/VerifyEmailPage')) },
    ],
  },
  // ─── Admin ─────────────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: Lazy(() => import('@/pages/admin/DashboardPage')) },
      { path: 'products', element: Lazy(() => import('@/pages/admin/products/ProductsListPage')) },
      { path: 'products/new', element: Lazy(() => import('@/pages/admin/products/ProductFormPage')) },
      { path: 'products/:id/edit', element: Lazy(() => import('@/pages/admin/products/ProductFormPage')) },
      { path: 'categories', element: Lazy(() => import('@/pages/admin/CategoriesPage')) },
      { path: 'orders', element: Lazy(() => import('@/pages/admin/orders/OrdersListPage')) },
      { path: 'orders/:id', element: Lazy(() => import('@/pages/admin/orders/OrderDetailPage')) },
      { path: 'users', element: Lazy(() => import('@/pages/admin/UsersPage')) },
      { path: 'reviews', element: Lazy(() => import('@/pages/admin/ReviewsPage')) },
      { path: 'coupons', element: Lazy(() => import('@/pages/admin/CouponsPage')) },
      { path: 'banners', element: Lazy(() => import('@/pages/admin/BannersPage')) },
      { path: 'support', element: Lazy(() => import('@/pages/admin/SupportPage')) },
      { path: 'analytics', element: Lazy(() => import('@/pages/admin/AnalyticsPage')) },
      { path: 'settings', element: Lazy(() => import('@/pages/admin/SettingsPage')) },
    ],
  },
  // ─── 404 ───────────────────────────────────────────────────────────────────
  { path: '*', element: Lazy(() => import('@/pages/NotFoundPage')) },
])

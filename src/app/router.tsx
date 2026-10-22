import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import RootLayout from '@/components/layout/RootLayout'
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
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,                   element: Lazy(() => import('@/pages/HomePage')) },
      { path: 'products/:slug',        element: Lazy(() => import('@/pages/ProductDetailPage')) },
      { path: 'categories/gaming',        element: Lazy(() => import('@/pages/GamingPage')) },
      { path: 'categories/accessories',  element: Lazy(() => import('@/pages/AccessoriesPage')) },
      { path: 'categories/smart-home',   element: Lazy(() => import('@/pages/SmartHomePage')) },
      { path: 'categories/:slug',        element: Lazy(() => import('@/pages/CategoryPage')) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

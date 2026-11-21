import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout/Layout'
import { PageLoader } from '@/components/ui/PageLoader'
import { ProtectedRoute } from './ProtectedRoute'

const Home = lazy(() => import('@/pages/Home'))
const Shop = lazy(() => import('@/pages/Shop'))
const Cart = lazy(() => import('@/pages/Cart'))
const OwnerLogin = lazy(() => import('@/pages/OwnerLogin'))
const Admin = lazy(() => import('@/pages/Admin'))
const CreateProduct = lazy(() => import('@/pages/CreateProduct'))

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="owner-login" element={<OwnerLogin />} />

          {/* Protected Owner/Admin Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/create-product"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateProduct />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

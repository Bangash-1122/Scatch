import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import Home from '../pages/Home'
import Shop from '../pages/Shop'
import Cart from '../pages/Cart'
import OwnerLogin from '../pages/OwnerLogin'
import Admin from '../pages/Admin'
import CreateProduct from '../pages/CreateProduct'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
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
  )
}

import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStore } from '../context/StoreContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'admin' | 'owner' | 'user'
}

export function ProtectedRoute({ children, requiredRole = 'admin' }: ProtectedRouteProps) {
  const { user } = useStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/owner-login" state={{ from: location }} replace />
  }

  if (requiredRole === 'admin' || requiredRole === 'owner') {
    if (user.role !== 'admin' && user.role !== 'owner') {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../lib/AppContext'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { currentUser, authLoading } = useApp()
  const location = useLocation()
  if (authLoading) return null // FE-2: never redirect mid-rehydration
  if (!currentUser) {
    return <Navigate to="/signup" replace state={{ redirectTo: location.pathname }} />
  }
  return <>{children}</>
}

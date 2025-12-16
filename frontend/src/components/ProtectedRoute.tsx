import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { JSX } from 'react'

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { data: user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

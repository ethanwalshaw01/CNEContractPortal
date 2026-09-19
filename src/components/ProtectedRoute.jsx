import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageSpinner } from '@/components/common/Spinner'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) return <PageSpinner />
  if (!session) return <Navigate to="/login" replace />

  return <Outlet />
}

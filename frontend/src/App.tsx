import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import { useSocketAuth } from './hooks/useSocketAuth'
import Dashboard from './pages/Dashboard'
import { useNotifications } from './hooks/useNotifications'

export default function App() {
  const { data: user } = useAuth()
  useSocketAuth(user)
  const notification = useNotifications()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {notification && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded">
          {notification}
        </div>
      )}
    </BrowserRouter>
  )
}

import { logout } from '../api/auth'
import { useAuthUtils } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function Navbar() {
  const { clearUser } = useAuthUtils()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    clearUser()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between">
      <span className="font-semibold">Task Manager</span>

      <button onClick={handleLogout} className="text-sm text-red-600">
        Logout
      </button>
    </nav>
  )
}

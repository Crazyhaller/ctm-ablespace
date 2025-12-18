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
    <nav className="card flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-[var(--color-accent)] flex items-center justify-center font-bold">
          TM
        </div>
        <span className="text-lg font-semibold">Task Manager</span>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleLogout} className="btn-ghost">
          Logout
        </button>
      </div>
    </nav>
  )
}

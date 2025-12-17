import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow text-center space-y-4">
        <h1 className="text-xl font-semibold">Collaborative Task Manager</h1>

        <div className="flex gap-4 justify-center">
          <Link to="/login" className="bg-black text-white px-4 py-2 rounded">
            Login
          </Link>
          <Link to="/register" className="border px-4 py-2 rounded">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

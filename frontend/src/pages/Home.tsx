import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <div className="card text-center space-y-4 max-w-2xl w-full">
        <h1 className="text-3xl font-semibold">Collaborative Task Manager</h1>

        <p className="muted">
          A minimal project to manage tasks with assignment and notifications.
        </p>

        <div className="flex gap-4 justify-center mt-4">
          <Link to="/login" className="btn-primary">
            Login
          </Link>
          <Link to="/register" className="btn-ghost">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/auth.schema'
import { login } from '../api/auth'
import { useAuthUtils } from '../hooks/useAuth'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()

  const { setUser } = useAuthUtils()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    const user = await login(data)
    setUser(user)
    navigate('/dashboard')
  }

  return (
    <div className="container">
      <div className="card max-w-md mx-auto mt-12">
        <h2 className="text-lg font-semibold mb-4">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register('email')} placeholder="Email" className="input" />
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="input"
          />

          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}

          <button disabled={isSubmitting} className="btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../schemas/auth.schema'
import { register as registerUser } from '../api/auth'
import { useAuthUtils } from '../hooks/useAuth'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()

  const { setUser } = useAuthUtils()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterForm) {
    const user = await registerUser(data)
    setUser(user)
    navigate('/dashboard')
  }

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register('name')}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
        <input
          {...register('email')}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />
        {errors.password && (
          <p className="text-sm text-red-600">
            Password must be at least 8 characters
          </p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  )
}

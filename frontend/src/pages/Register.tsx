import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../schemas/auth.schema'
import { register as registerUser } from '../api/auth'
import { useAuthUtils } from '../hooks/useAuth'
import { z } from 'zod'

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const { setUser } = useAuthUtils()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterForm) {
    const user = await registerUser(data)
    setUser(user)
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
        <input
          {...register('email')}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
        />

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

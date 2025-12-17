import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskFormSchema } from '../schemas/task.schema'
import { z } from 'zod'
import { useUsers } from '../hooks/useUsers'
import { useAuth } from '../hooks/useAuth'

type TaskFormData = z.infer<typeof taskFormSchema>

export function TaskForm({
  onSubmit,
  initialValues,
}: {
  onSubmit: (data: TaskFormData) => void
  initialValues?: Partial<TaskFormData>
}) {
  const { register, handleSubmit } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialValues,
  })
  const { data: authUser } = useAuth()
  const { data: users } = useUsers()

  const assignableUsers = users?.filter((u) => u.id !== authUser?.id)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        {...register('title')}
        placeholder="Title"
        className="border p-2 w-full"
      />
      <textarea
        {...register('description')}
        placeholder="Description"
        className="border p-2 w-full"
      />
      <input
        type="date"
        {...register('dueDate')}
        className="border p-2 w-full"
      />

      <select {...register('assignedToId')}>
        <option value="">Unassigned</option>
        {assignableUsers?.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name || u.email}
          </option>
        ))}
      </select>

      <select {...register('priority')} className="border p-2 w-full">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <button className="bg-black text-white px-4 py-2 rounded">
        Save Task
      </button>
    </form>
  )
}

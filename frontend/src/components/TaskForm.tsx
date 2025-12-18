import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskCreateSchema, taskUpdateSchema } from '../schemas/task.schema'
import type {
  TaskCreateFormData,
  TaskUpdateFormData,
} from '../schemas/task.schema'

import { useUsers } from '../hooks/useUsers'
import { useAuth } from '../hooks/useAuth'

type TaskFormProps =
  | {
      mode: 'create'
      onSubmit: (data: TaskCreateFormData) => void
      initialValues?: Partial<TaskCreateFormData>
      onCancel?: never
    }
  | {
      mode: 'edit'
      onSubmit: (data: TaskUpdateFormData) => void
      initialValues: TaskUpdateFormData
      onCancel: () => void
    }

export function TaskForm(props: TaskFormProps) {
  const { data: authUser } = useAuth()
  const { data: users } = useUsers()

  const isEdit = props.mode === 'edit'

  const form = useForm<TaskCreateFormData | TaskUpdateFormData>({
    resolver: zodResolver(isEdit ? taskUpdateSchema : taskCreateSchema),
    defaultValues: props.initialValues,
  })

  const { register, handleSubmit } = form

  const assignableUsers = users?.filter((u: any) => u.id !== authUser?.id)

  return (
    <form onSubmit={handleSubmit(props.onSubmit as any)} className="space-y-3">
      <input {...register('title')} placeholder="Title" className="input" />

      <textarea
        {...register('description')}
        placeholder="Description"
        className="input h-28"
      />

      <input type="date" {...register('dueDate')} className="input" />

      <select {...register('priority')} className="input">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      {isEdit && (
        <select {...register('status')} className="input">
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>
      )}

      <select {...register('assignedToId')} className="input">
        <option value="">Unassigned</option>
        {assignableUsers?.map((u: any) => (
          <option key={u.id} value={u.id}>
            {u.name || u.email}
          </option>
        ))}
      </select>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary">
          Save Task
        </button>

        {isEdit && (
          <button type="button" onClick={props.onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

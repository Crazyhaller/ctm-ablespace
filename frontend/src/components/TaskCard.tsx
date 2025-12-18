import { useState } from 'react'
import type { Task } from '../types/task'
import { TaskForm } from './TaskForm'
import { useUpdateTask } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import type { TaskPriority, TaskStatus } from '../types/task'

export function TaskCard({
  task,
  onDelete,
}: {
  task: Task
  onDelete: () => void
}) {
  const { data: user } = useAuth()
  const updateTask = useUpdateTask()

  const [isEditing, setIsEditing] = useState(false)

  const isOverdue =
    task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date()

  function handleUpdate(data: {
    title: string
    description: string
    dueDate: string
    priority: TaskPriority
    status?: TaskStatus
    assignedToId?: string
  }) {
    updateTask.mutate(
      {
        id: task.id,
        data: {
          title: data.title,
          description: data.description,
          dueDate: new Date(data.dueDate).toISOString(),
          priority: data.priority,
          status: data.status,
          assignedToId: data.assignedToId || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  // ------------------------------
  // EDIT MODE
  // ------------------------------
  if (isEditing) {
    return (
      <div className="border rounded p-4 bg-white shadow-sm">
        <TaskForm
          mode="edit"
          initialValues={{
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            assignedToId: task.assignedToId ?? undefined,
          }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  // ------------------------------
  // VIEW MODE
  // ------------------------------
  return (
    <div className="border rounded p-4 bg-white shadow-sm space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{task.title}</h3>
        {isOverdue && (
          <span className="text-xs text-red-600 font-medium">Overdue</span>
        )}
      </div>

      <p className="text-sm text-gray-600">{task.description}</p>

      <div className="text-xs text-gray-500">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </div>

      <div className="text-xs text-gray-500 flex items-center justify-between">
        <div>
          Priority: {task.priority} · Status: {task.status}
        </div>

        {/* If current user is the assignee, allow quick status change */}
        {task.assignedToId === user?.id && (
          <select
            value={task.status}
            onChange={(e) =>
              updateTask.mutate({
                id: task.id,
                data: { status: e.target.value as any },
              })
            }
            className="text-xs border p-1 rounded"
            disabled={(updateTask as any).isLoading}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        {/* Edit only for creator */}
        {task.creatorId === user?.id && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-600"
          >
            Edit
          </button>
        )}

        {/* Delete only for creator */}
        {task.creatorId === user?.id && (
          <button onClick={onDelete} className="text-xs text-red-600">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

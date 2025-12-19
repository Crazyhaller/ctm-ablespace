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
  const updateTask = useUpdateTask(user!.id)

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
      <div className="card">
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
  const statusClass =
    task.status === 'COMPLETED'
      ? 'bg-[rgba(16,185,129,0.12)] text-[var(--color-success)]'
      : task.status === 'IN_PROGRESS'
      ? 'bg-[rgba(124,58,237,0.08)] text-[var(--color-accent)]'
      : 'bg-[rgba(255,255,255,0.02)] text-[var(--color-foreground)]'

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <p className="text-sm muted mt-1">{task.description}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isOverdue && (
            <span className="text-xs text-[var(--color-danger)] font-semibold">
              Overdue
            </span>
          )}
          <div className={`badge badge-status ${statusClass}`}>
            {task.status}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm muted">
          <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
          <div>·</div>
          <div
            className={`badge ${
              task.priority === 'LOW'
                ? 'badge-priority-low'
                : 'badge-priority-high'
            }`}
          >
            {task.priority}
          </div>
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
            className="input w-40 text-sm"
            disabled={(updateTask as any).isLoading}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        )}
      </div>

      <div className="mt-3 flex gap-3">
        {/* Edit only for creator */}
        {task.creatorId === user?.id && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-ghost text-sm"
          >
            Edit
          </button>
        )}

        {/* Delete only for creator */}
        {task.creatorId === user?.id && (
          <button onClick={onDelete} className="btn-ghost text-sm">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

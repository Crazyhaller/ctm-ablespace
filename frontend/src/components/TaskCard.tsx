import type { Task } from '../types/task'

export function TaskCard({
  task,
  onDelete,
}: {
  task: Task
  onDelete: () => void
}) {
  const isOverdue =
    task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date()

  return (
    <div className="border rounded p-4 bg-white shadow-sm">
      <div className="flex justify-between">
        <h3 className="font-semibold">{task.title}</h3>
        {isOverdue && <span className="text-xs text-red-600">Overdue</span>}
      </div>

      <p className="text-sm text-gray-600 mt-1">{task.description}</p>

      <div className="mt-2 text-xs text-gray-500">
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </div>

      <button onClick={onDelete} className="mt-2 text-xs text-red-600">
        Delete
      </button>
    </div>
  )
}

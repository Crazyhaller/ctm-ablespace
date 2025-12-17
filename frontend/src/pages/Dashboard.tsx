import { useTasks, useDeleteTask } from '../hooks/useTasks'
import { useAuth } from '../hooks/useAuth'
import { TaskCard } from '../components/TaskCard'
import { useTaskSockets } from '../sockets/useTaskSockets'
import type { TaskStatus, TaskPriority } from '../types/task'
import { useState } from 'react'
import { TaskSkeleton } from '../components/TaskSkeleton'
import { TaskForm } from '../components/TaskForm'
import { useCreateTask } from '../hooks/useTasks'
import { Navbar } from '../components/Navbar'

export default function Dashboard() {
  const { data: user } = useAuth()
  const { data: tasks, isLoading, error } = useTasks()
  const deleteTask = useDeleteTask()
  useTaskSockets()
  const [status, setStatus] = useState<TaskStatus | 'ALL'>('ALL')
  const [priority, setPriority] = useState<TaskPriority | 'ALL'>('ALL')
  const [showForm, setShowForm] = useState(false)
  const createTask = useCreateTask()

  function handleCreateTask(data: {
    title: string
    description: string
    dueDate: string
    priority: TaskPriority
    assignedToId?: string
  }) {
    createTask.mutate(
      {
        ...data,
        assignedToId: data.assignedToId || undefined,
        dueDate: new Date(data.dueDate).toISOString(),
      },
      {
        onSuccess: () => {
          setShowForm(false)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 grid gap-3">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    )
  }

  if (error) {
    return <div className="p-6 text-red-600">Failed to load tasks.</div>
  }

  const filtered =
    tasks?.filter((t) => {
      if (status !== 'ALL' && t.status !== status) return false
      if (priority !== 'ALL' && t.priority !== priority) return false
      return true
    }) ?? []

  const assigned = filtered.filter((t) => t.assignedToId === user?.id)
  const created = filtered.filter((t) => t.creatorId === user?.id)

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {showForm && (
          <div className="border rounded p-4 bg-white">
            <TaskForm onSubmit={handleCreateTask} />
          </div>
        )}

        <div className="flex gap-4">
          <select
            onChange={(e) => setStatus(e.target.value as TaskStatus | 'ALL')}
          >
            <option value="ALL">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            onChange={(e) =>
              setPriority(e.target.value as TaskPriority | 'ALL')
            }
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <section>
          <h2 className="font-medium mb-2">Tasks Assigned To Me</h2>
          <div className="grid gap-3">
            {assigned.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={() => deleteTask.mutate(task.id)}
              />
            ))}
            {assigned.length === 0 && (
              <p className="text-sm text-gray-500">No tasks assigned to you.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-medium mb-2">Tasks I Created</h2>
          <div className="grid gap-3">
            {created.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={() => deleteTask.mutate(task.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

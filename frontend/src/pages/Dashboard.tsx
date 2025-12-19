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
  const { data: tasks, isLoading, error } = useTasks(user)

  const deleteTask = useDeleteTask(user!.id)
  useTaskSockets()
  const [status, setStatus] = useState<TaskStatus | 'ALL'>('ALL')
  const [priority, setPriority] = useState<TaskPriority | 'ALL'>('ALL')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const [showForm, setShowForm] = useState(false)
  const createTask = useCreateTask(user!.id)

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

  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()

    return sortOrder === 'ASC' ? diff : -diff
  })

  const now = new Date()

  const overdue = sorted.filter(
    (t) => new Date(t.dueDate) < now && t.status !== 'COMPLETED'
  )

  const assigned = sorted.filter((t) => t.assignedToId === user?.id)

  const created = sorted.filter((t) => t.creatorId === user?.id)

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'New Task'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <TaskForm mode="create" onSubmit={handleCreateTask} />
          </div>
        )}

        <div className="flex gap-4">
          <select
            onChange={(e) => setStatus(e.target.value as TaskStatus | 'ALL')}
            className="input w-48"
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
            className="input w-48"
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
            className="input w-36"
          >
            <option value="ASC">Due Date ↑</option>
            <option value="DESC">Due Date ↓</option>
          </select>
        </div>

        {overdue.length > 0 && (
          <section>
            <h2 className="font-medium mb-2 text-[var(--color-danger)]">
              Overdue Tasks
            </h2>
            <div className="grid gap-3">
              {overdue.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={() => deleteTask.mutate(task.id)}
                />
              ))}
            </div>
          </section>
        )}

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
              <p className="text-sm muted">No tasks assigned to you.</p>
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

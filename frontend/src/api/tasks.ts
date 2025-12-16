import { api } from './client'
import type { Task } from '../types/task'

export async function getTasks(): Promise<Task[]> {
  const res = await api.get('/tasks')
  return res.data.tasks
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  const res = await api.post('/tasks', data)
  return res.data.task
}

export async function updateTask(
  id: string,
  data: Partial<Task>
): Promise<Task> {
  const res = await api.patch(`/tasks/${id}`, data)
  return res.data.task
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`)
}

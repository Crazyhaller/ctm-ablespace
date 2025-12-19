import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/auth.middleware'
import { createTaskSchema, updateTaskSchema } from '../validators/task.schema'
import { TaskService } from '../services/task.service'

const taskService = new TaskService()

export async function createTask(req: AuthenticatedRequest, res: Response) {
  const parsed = createTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  // 🔑 Normalize assignedToId at the boundary
  const assignedToId =
    parsed.data.assignedToId && parsed.data.assignedToId.trim() !== ''
      ? parsed.data.assignedToId
      : undefined

  try {
    const task = await taskService.createTask(req.userId!, {
      title: parsed.data.title,
      description: parsed.data.description,
      dueDate: new Date(parsed.data.dueDate),
      priority: parsed.data.priority,
      assignedToId, // ✅ normalized
    })

    return res.status(201).json({ task })
  } catch (err) {
    const msg = (err as Error).message

    if (msg === 'ASSIGNEE_NOT_FOUND') {
      return res.status(404).json({ message: 'Assignee not found' })
    }

    throw err
  }
}

import { buildTaskUpdates } from './task.util.js'

export async function updateTask(req: AuthenticatedRequest, res: Response) {
  const parsed = updateTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  // 🔑 Normalize update payload
  const updates = buildTaskUpdates(parsed.data)

  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.userId!,
      updates
    )

    return res.json({ task })
  } catch (err) {
    const msg = (err as Error).message

    if (msg === 'TASK_NOT_FOUND') {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (msg === 'FORBIDDEN') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    if (msg === 'ASSIGNEE_NOT_FOUND') {
      return res.status(404).json({ message: 'Assignee not found' })
    }

    throw err
  }
}
export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  try {
    await taskService.deleteTask(req.params.id, req.userId!)
    return res.status(204).send()
  } catch (err) {
    const msg = (err as Error).message

    if (msg === 'TASK_NOT_FOUND') {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (msg === 'FORBIDDEN') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    throw err
  }
}

export async function getDashboardTasks(
  req: AuthenticatedRequest,
  res: Response
) {
  const tasks = await taskService.getDashboardTasks(req.userId!)
  return res.json({ tasks })
}

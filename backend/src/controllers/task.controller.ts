import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js'
import {
  createTaskSchema,
  updateTaskSchema,
} from '../validators/task.schema.js'
import { TaskService } from '../services/task.service.js'

const taskService = new TaskService()

export async function createTask(req: AuthenticatedRequest, res: Response) {
  const parsed = createTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  try {
    const task = await taskService.createTask(req.userId!, {
      ...parsed.data,
      dueDate: new Date(parsed.data.dueDate),
    })
    res.status(201).json({ task })
  } catch (err) {
    if ((err as Error).message === 'ASSIGNEE_NOT_FOUND') {
      return res.status(404).json({ message: 'Assignee not found' })
    }
    throw err
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response) {
  const parsed = updateTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.userId!,
      parsed.data
    )
    res.json({ task })
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
    res.status(204).send()
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
  res.json({ tasks })
}

import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware.js'
import {
  createTask,
  updateTask,
  deleteTask,
  getDashboardTasks,
} from '../controllers/task.controller.js'

export const taskRouter = Router()

taskRouter.use(requireAuth)

taskRouter.post('/', createTask)
taskRouter.get('/', getDashboardTasks)
taskRouter.patch('/:id', updateTask)
taskRouter.delete('/:id', deleteTask)

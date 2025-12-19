import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware'
import {
  createTask,
  updateTask,
  deleteTask,
  getDashboardTasks,
} from '../controllers/task.controller'

export const taskRouter = Router()

taskRouter.use(requireAuth)

taskRouter.post('/', createTask)
taskRouter.get('/', getDashboardTasks)
taskRouter.patch('/:id', updateTask)
taskRouter.delete('/:id', deleteTask)

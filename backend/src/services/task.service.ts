import { TaskRepository } from '../repositories/task.repository.js'
import { UserRepository } from '../repositories/user.repository.js'
import { io } from '../server.js'

export class TaskService {
  private taskRepo = new TaskRepository()
  private userRepo = new UserRepository()

  async createTask(
    creatorId: string,
    data: {
      title: string
      description: string
      dueDate: Date
      priority: any
      assignedToId?: string
    }
  ) {
    if (data.assignedToId) {
      const user = await this.userRepo.findById(data.assignedToId)
      if (!user) {
        throw new Error('ASSIGNEE_NOT_FOUND')
      }
    }

    const task = await this.taskRepo.create({
      ...data,
      creatorId,
    })

    if (task.assignedToId) {
      io.emit('task:assigned', {
        taskId: task.id,
        assignedToId: task.assignedToId,
      })
    }

    return task
  }

  async updateTask(taskId: string, userId: string, updates: any) {
    const task = await this.taskRepo.findById(taskId)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    if (task.creatorId !== userId) {
      throw new Error('FORBIDDEN')
    }

    if (updates.assignedToId) {
      const user = await this.userRepo.findById(updates.assignedToId)
      if (!user) {
        throw new Error('ASSIGNEE_NOT_FOUND')
      }
    }

    const updated = await this.taskRepo.update(taskId, updates)

    io.emit('task:updated', updated)

    if (updates.assignedToId && updates.assignedToId !== task.assignedToId) {
      io.emit('task:assigned', {
        taskId: updated.id,
        assignedToId: updated.assignedToId,
      })
    }

    return updated
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.taskRepo.findById(taskId)
    if (!task) {
      throw new Error('TASK_NOT_FOUND')
    }

    if (task.creatorId !== userId) {
      throw new Error('FORBIDDEN')
    }

    return this.taskRepo.delete(taskId)
  }

  async getDashboardTasks(userId: string) {
    return this.taskRepo.findForDashboard(userId)
  }
}

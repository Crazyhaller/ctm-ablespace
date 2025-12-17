import { TaskRepository } from '../repositories/task.repository.js'
import { UserRepository } from '../repositories/user.repository.js'
import { emitToUser, io } from '../server.js'

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
      assignedToId?: string | null
    }
  ) {
    const assignedToId =
      data.assignedToId && data.assignedToId.trim() !== ''
        ? data.assignedToId
        : null

    if (assignedToId) {
      const user = await this.userRepo.findById(assignedToId)
      if (!user) {
        throw new Error('ASSIGNEE_NOT_FOUND')
      }
    }

    const task = await this.taskRepo.create({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      creatorId,
      assignedToId,
    })

    // 🔔 Notify ONLY the assigned user
    if (task.assignedToId) {
      emitToUser(task.assignedToId, 'task:assigned', {
        taskId: task.id,
        assignedToId: task.assignedToId,
        title: task.title,
        creatorId: task.creatorId,
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

    let nextAssignedToId: string | null | undefined = undefined

    if ('assignedToId' in updates) {
      if (updates.assignedToId && updates.assignedToId.trim() !== '') {
        const user = await this.userRepo.findById(updates.assignedToId)
        if (!user) {
          throw new Error('ASSIGNEE_NOT_FOUND')
        }
        nextAssignedToId = updates.assignedToId
      } else {
        nextAssignedToId = null
      }
    }

    const updated = await this.taskRepo.update(taskId, {
      ...updates,
      assignedToId: nextAssignedToId,
    })

    io.emit('task:updated', updated)

    if (nextAssignedToId && nextAssignedToId !== task.assignedToId) {
      emitToUser(nextAssignedToId, 'task:assigned', {
        taskId: updated.id,
        assignedToId: updated.assignedToId,
        title: updated.title,
        creatorId: updated.creatorId,
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

    await this.taskRepo.delete(taskId)

    // 🔔 Notify assigned user (if exists)
    if (task.assignedToId) {
      emitToUser(task.assignedToId, 'task:deleted', {
        taskId: task.id,
      })
    }

    // 🔔 Notify creator (optional but clean)
    emitToUser(task.creatorId, 'task:deleted', {
      taskId: task.id,
    })
  }

  async getDashboardTasks(userId: string) {
    return this.taskRepo.findForDashboard(userId)
  }
}

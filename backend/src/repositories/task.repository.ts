import { prisma } from '../lib/prisma.js'
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from '../../generated/prisma/client'

export class TaskRepository {
  create(data: {
    title: string
    description: string
    dueDate: Date
    priority: TaskPriority
    creatorId: string
    assignedToId?: string
  }): Promise<Task> {
    return prisma.task.create({ data })
  }

  findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } })
  }

  update(
    id: string,
    data: Partial<{
      title: string
      description: string
      dueDate: Date
      priority: TaskPriority
      status: TaskStatus
      assignedToId: string | null
    }>
  ): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
    })
  }

  delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } })
  }

  findForDashboard(userId: string) {
    return prisma.task.findMany({
      where: {
        OR: [{ creatorId: userId }, { assignedToId: userId }],
      },
      orderBy: { dueDate: 'asc' },
    })
  }
}

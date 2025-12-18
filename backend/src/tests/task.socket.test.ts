jest.mock('../lib/prisma.js', () => {
  return {
    prisma: require('./__mocks__/prisma').prisma,
  }
})

import { TaskService } from '../services/task.service.js'
import { prisma } from '../lib/prisma.js'
import { io } from '../server.js'

jest.mock('../server.js')

describe('TaskService socket emissions', () => {
  const service = new TaskService()

  it('notifies the new assignee when assigning a task', async () => {
    jest.spyOn(prisma.task, 'findUnique').mockResolvedValue({
      id: 'task-id',
      creatorId: 'creator-id',
      assignedToId: null,
      title: 'Task!',
    } as any)

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'assignee-id',
    } as any)

    jest.spyOn(prisma.task, 'update').mockResolvedValue({
      id: 'task-id',
      assignedToId: 'assignee-id',
      title: 'Task!',
      creatorId: 'creator-id',
    } as any)

    await service.updateTask('task-id', 'creator-id', {
      assignedToId: 'assignee-id',
    })

    expect((require('../server.js') as any).emitToUser).toHaveBeenCalledWith(
      'assignee-id',
      'task:assigned',
      {
        taskId: 'task-id',
        assignedToId: 'assignee-id',
        title: 'Task!',
        creatorId: 'creator-id',
      }
    )
  })

  it('notifies assigned user when creator updates the task', async () => {
    jest.spyOn(prisma.task, 'findUnique').mockResolvedValue({
      id: 'task-id',
      creatorId: 'creator-id',
      assignedToId: 'assignee-id',
      title: 'Important',
    } as any)

    jest.spyOn(prisma.task, 'update').mockResolvedValue({
      id: 'task-id',
      assignedToId: 'assignee-id',
      title: 'Important',
      creatorId: 'creator-id',
    } as any)

    await service.updateTask('task-id', 'creator-id', {
      status: 'IN_PROGRESS',
    })

    expect(io.emit).toHaveBeenCalledWith('task:updated', {
      taskId: 'task-id',
      title: 'Important',
      assignedToId: 'assignee-id',
      updatedById: 'creator-id',
      creatorId: 'creator-id',
    })
  })

  it('notifies creator when assignee updates status', async () => {
    jest.spyOn(prisma.task, 'findUnique').mockResolvedValue({
      id: 'task-id',
      creatorId: 'creator-id',
      assignedToId: 'assignee-id',
      title: 'Important',
    } as any)

    jest.spyOn(prisma.task, 'update').mockResolvedValue({
      id: 'task-id',
      assignedToId: 'assignee-id',
      title: 'Important',
      status: 'COMPLETED',
      creatorId: 'creator-id',
    } as any)

    await service.updateTask('task-id', 'assignee-id', {
      status: 'COMPLETED',
    })

    // broadcast-only; the creator will receive the single 'task:updated' event
    expect(io.emit).toHaveBeenCalledWith('task:updated', {
      taskId: 'task-id',
      title: 'Important',
      assignedToId: 'assignee-id',
      updatedById: 'assignee-id',
      creatorId: 'creator-id',
    })
  })

  it('allows assigned user to update status only', async () => {
    jest.spyOn(prisma.task, 'findUnique').mockResolvedValue({
      id: 'task-id',
      creatorId: 'creator-id',
      assignedToId: 'assignee-id',
      title: 'Important',
    } as any)

    jest.spyOn(prisma.task, 'update').mockResolvedValue({
      id: 'task-id',
      assignedToId: 'assignee-id',
      title: 'Important',
      status: 'COMPLETED',
      creatorId: 'creator-id',
    } as any)

    await service.updateTask('task-id', 'assignee-id', {
      status: 'COMPLETED',
    })

    expect(io.emit).toHaveBeenCalledWith('task:updated', expect.any(Object))
  })

  it('rejects assigned user trying to update forbidden fields', async () => {
    jest.spyOn(prisma.task, 'findUnique').mockResolvedValue({
      id: 'task-id',
      creatorId: 'creator-id',
      assignedToId: 'assignee-id',
      title: 'Important',
    } as any)

    await expect(
      service.updateTask('task-id', 'assignee-id', { priority: 'HIGH' } as any)
    ).rejects.toThrow('FORBIDDEN')
  })
})

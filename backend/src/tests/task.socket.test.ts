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

  it('emits task:assigned event when assigning a task', async () => {
    jest.spyOn(prisma.task, 'findUnique').mockResolvedValue({
      id: 'task-id',
      creatorId: 'creator-id',
      assignedToId: null,
    } as any)

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'assignee-id',
    } as any)

    jest.spyOn(prisma.task, 'update').mockResolvedValue({
      id: 'task-id',
      assignedToId: 'assignee-id',
    } as any)

    await service.updateTask('task-id', 'creator-id', {
      assignedToId: 'assignee-id',
    })

    expect(io.emit).toHaveBeenCalledWith('task:assigned', {
      taskId: 'task-id',
      assignedToId: 'assignee-id',
    })
  })
})

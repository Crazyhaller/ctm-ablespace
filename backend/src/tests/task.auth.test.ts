jest.mock('../lib/prisma.js', () => {
  return {
    prisma: require('./__mocks__/prisma').prisma,
  }
})

import { TaskService } from '../services/task.service.js'
import { prisma } from '../lib/prisma.js'

jest.mock('../server.js')

describe('TaskService.updateTask authorization', () => {
  const service = new TaskService()

  it('prevents non-creator from updating task', async () => {
    jest.spyOn(prisma.task, 'findUnique').mockResolvedValue({
      id: 'task-id',
      creatorId: 'creator-id',
      assignedToId: null,
    } as any)

    await expect(
      service.updateTask('task-id', 'other-user-id', {
        title: 'Hacked title',
      })
    ).rejects.toThrow('FORBIDDEN')
  })
})

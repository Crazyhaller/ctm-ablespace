jest.mock('../lib/prisma.js', () => {
  return {
    prisma: require('./__mocks__/prisma').prisma,
  }
})

import { TaskService } from '../services/task.service.js'
import { prisma } from '../lib/prisma.js'

jest.mock('../server.js')

describe('TaskService.createTask', () => {
  const service = new TaskService()

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('throws error when assigned user does not exist', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null as any)

    await expect(
      service.createTask('creator-id', {
        title: 'Test Task',
        description: 'Test description',
        dueDate: new Date(),
        priority: 'LOW',
        assignedToId: 'non-existent-user',
      })
    ).rejects.toThrow('ASSIGNEE_NOT_FOUND')
  })
})

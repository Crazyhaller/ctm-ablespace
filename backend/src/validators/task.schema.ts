import { z } from 'zod'

export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])

export const taskStatusEnum = z.enum([
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'COMPLETED',
])

export const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string().datetime(),
  priority: taskPriorityEnum,
  assignedToId: z.string().uuid().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
  assignedToId: z.string().uuid().nullable().optional(),
})

import { z } from 'zod'

export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])

export const taskStatusEnum = z.enum([
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'COMPLETED',
])

/**
 * Normalize empty string -> null for optional assignment
 */
const assignedToIdSchema = z.preprocess((val) => {
  if (val === '' || val === undefined) return null
  return val
}, z.string().uuid().nullable())

export const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string().datetime(),
  priority: taskPriorityEnum,
  assignedToId: assignedToIdSchema.optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: taskPriorityEnum.optional(),
  status: taskStatusEnum.optional(),
  assignedToId: assignedToIdSchema.optional(),
})

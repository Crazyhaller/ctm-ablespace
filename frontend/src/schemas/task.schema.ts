import { z } from 'zod'

export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])

export const taskStatusEnum = z.enum([
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'COMPLETED',
])

/**
 * CREATE task schema
 */
export const taskCreateSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string(),
  dueDate: z.string(),
  priority: taskPriorityEnum,
  assignedToId: z.string().optional(),
})

/**
 * UPDATE task schema
 */
export const taskUpdateSchema = taskCreateSchema.extend({
  status: taskStatusEnum,
})

export type TaskCreateFormData = z.infer<typeof taskCreateSchema>
export type TaskUpdateFormData = z.infer<typeof taskUpdateSchema>

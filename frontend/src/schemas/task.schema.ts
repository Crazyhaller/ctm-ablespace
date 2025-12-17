import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().max(100),
  description: z.string(),
  dueDate: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assignedToId: z.string().uuid().optional(),
})

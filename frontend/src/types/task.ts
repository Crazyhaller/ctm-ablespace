export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  creatorId: string
  assignedToId?: string | null
}

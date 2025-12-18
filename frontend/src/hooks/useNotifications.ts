import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { socket } from '../sockets/socket'
import { useAuth } from './useAuth'

interface TaskAssignedPayload {
  taskId: string
  assignedToId: string
  title: string
  creatorId: string
}

export function useNotifications() {
  const { data: user } = useAuth()

  useEffect(() => {
    if (!user) return

    const handleTaskAssigned = (payload: TaskAssignedPayload) => {
      if (payload.assignedToId !== user.id) return
      toast.info(`📝 New task assigned: ${payload.title}`)
    }

    const handleTaskUpdated = (payload: {
      taskId: string
      title: string
      assignedToId?: string | null
      updatedById: string
      creatorId?: string
    }) => {
      // Assigned user: notify when someone else (creator) updated the task
      if (payload.assignedToId === user.id && payload.updatedById !== user.id) {
        toast.info(`✏️ Task updated: ${payload.title}`)
        return
      }

      // Creator: notify when someone else (assignee) updated the task (e.g., status change)
      if (payload.creatorId === user.id && payload.updatedById !== user.id) {
        toast.info(`🔁 Task updated by assignee: ${payload.title}`)
        return
      }
    }

    // Attach listeners once; socket.on will remain active across reconnects
    socket.on('task:assigned', handleTaskAssigned)
    socket.on('task:updated', handleTaskUpdated)

    return () => {
      socket.off('task:assigned', handleTaskAssigned)
      socket.off('task:updated', handleTaskUpdated)
    }
  }, [user])
}

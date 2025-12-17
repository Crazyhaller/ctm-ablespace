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

    const attachListeners = () => {
      socket.on('task:assigned', handleTaskAssigned)
    }

    const detachListeners = () => {
      socket.off('task:assigned', handleTaskAssigned)
    }

    // 🔑 Attach after connection
    if (socket.connected) {
      attachListeners()
    }

    // 🔁 Re-attach on reconnect
    socket.on('connect', attachListeners)

    return () => {
      detachListeners()
      socket.off('connect', attachListeners)
    }
  }, [user])
}

import { useEffect } from 'react'
import { socket } from './socket'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'

export function useTaskSockets() {
  const { data: user } = useAuth()
  const qc = useQueryClient()

  useEffect(() => {
    if (!user?.id) return

    const invalidateTasks = () => {
      qc.invalidateQueries({ queryKey: ['tasks', user.id] })
    }

    socket.on('task:updated', invalidateTasks)
    socket.on('task:assigned', invalidateTasks)
    socket.on('task:deleted', invalidateTasks)

    return () => {
      socket.off('task:updated', invalidateTasks)
      socket.off('task:assigned', invalidateTasks)
      socket.off('task:deleted', invalidateTasks)
    }
  }, [qc, user?.id])
}

import { useEffect } from 'react'
import { socket } from './socket'
import { useQueryClient } from '@tanstack/react-query'

export function useTaskSockets() {
  const qc = useQueryClient()

  useEffect(() => {
    const invalidateTasks = () => {
      qc.invalidateQueries({ queryKey: ['tasks', user.id] })
    }

    socket.on('task:updated', invalidateTasks)
    socket.on('task:assigned', invalidateTasks)
    socket.on('task:deleted', invalidateTasks) // ✅ NEW

    return () => {
      socket.off('task:updated', invalidateTasks)
      socket.off('task:assigned', invalidateTasks)
      socket.off('task:deleted', invalidateTasks)
    }
  }, [qc])
}

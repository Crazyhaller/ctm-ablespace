import { useEffect } from 'react'
import { socket } from './socket'
import { useQueryClient } from '@tanstack/react-query'

export function useTaskSockets() {
  const qc = useQueryClient()

  useEffect(() => {
    socket.on('task:updated', () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    })

    socket.on('task:assigned', () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
    })

    return () => {
      socket.off('task:updated')
      socket.off('task:assigned')
    }
  }, [qc])
}

import { useEffect, useState } from 'react'
import { socket } from '../sockets/socket'

export function useNotifications() {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    socket.on('task:assigned', () => {
      setMessage('You were assigned a new task')
      setTimeout(() => setMessage(null), 3000)
    })

    return () => {
      socket.off('task:assigned')
    }
  }, [])

  return message
}

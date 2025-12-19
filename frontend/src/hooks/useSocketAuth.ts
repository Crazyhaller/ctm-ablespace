import { useEffect } from 'react'
import { socket } from '../sockets/socket'
import type { User } from '../types/user'

export function useSocketAuth(user?: User) {
  useEffect(() => {
    if (!user?.id) {
      socket.disconnect()
      return
    }

    // Identify user BEFORE connecting
    socket.auth = { userId: user.id }

    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [user?.id])
}

import { useEffect } from 'react'
import { socket } from '../sockets/socket'
import type { User } from '../types/user'

export function useSocketAuth(user?: User) {
  useEffect(() => {
    if (!user) {
      if (socket.connected) {
        socket.disconnect()
      }
      return
    }

    // Identify the user BEFORE connecting
    socket.auth = { userId: user.id }

    if (!socket.connected) {
      socket.connect()
    }

    // ❌ DO NOT disconnect in cleanup (StrictMode safe)
  }, [user])
}

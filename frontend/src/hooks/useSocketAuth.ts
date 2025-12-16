import { useEffect } from 'react'
import { socket } from '../sockets/socket'
import type { User } from '../types/user'

export function useSocketAuth(user?: User) {
  useEffect(() => {
    if (user) {
      socket.connect()
    } else {
      socket.disconnect()
    }

    return () => {
      socket.disconnect()
    }
  }, [user])
}

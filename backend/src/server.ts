import http from 'http'
import { Server } from 'socket.io'
import { app } from './app.js'
import { env } from './config/env.js'

export const httpServer = http.createServer(app)

const FRONTEND_URL = (
  process.env.FRONTEND_URL ?? 'http://localhost:5173'
).replace(/\/$/, '')

export const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
})

// Map userId -> socketId
const userSockets = new Map<string, string>()

io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.userId as string | undefined

  if (userId) {
    userSockets.set(userId, socket.id)
    console.log(`User ${userId} connected via socket ${socket.id}`)
  }

  socket.on('disconnect', () => {
    if (userId) {
      userSockets.delete(userId)
      console.log(`User ${userId} disconnected`)
    }
  })
})

export function emitToUser(userId: string, event: string, payload: any) {
  const socketId = userSockets.get(userId)
  if (socketId) {
    io.to(socketId).emit(event, payload)
  }
}

export function startServer() {
  httpServer.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${env.PORT}`)
  })
}

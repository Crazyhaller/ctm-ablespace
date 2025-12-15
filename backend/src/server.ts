import http from 'http'
import { Server } from 'socket.io'
import { app } from './app.js'
import { env } from './config/env.js'

export const httpServer = http.createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`)
})

export function startServer() {
  httpServer.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`)
  })
}

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.routes.js'
import { taskRouter } from './routes/task.routes.js'
import { userRouter } from './routes/user.routes.js'

export const app = express()

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'
app.use(cors({ origin: FRONTEND_URL, credentials: true }))

app.use(express.json())
app.use(cookieParser())

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/auth', authRouter)
app.use('/tasks', taskRouter)
app.use('/users', userRouter)

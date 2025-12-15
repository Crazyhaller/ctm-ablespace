import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.routes.js'

export const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/auth', authRouter)

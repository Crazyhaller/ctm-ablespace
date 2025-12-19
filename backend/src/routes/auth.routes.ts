import { Router } from 'express'
import {
  register,
  login,
  logout,
  me,
  updateProfile,
} from '../controllers/auth.controller'
import { requireAuth } from '../middlewares/auth.middleware'

export const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.get('/me', requireAuth, me)
authRouter.patch('/me', requireAuth, updateProfile)

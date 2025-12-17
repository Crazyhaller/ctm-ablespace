import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { listUsers } from '../controllers/user.controller.js'

export const userRouter = Router()

userRouter.use(requireAuth)
userRouter.get('/', listUsers)

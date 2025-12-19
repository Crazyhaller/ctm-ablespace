import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware'
import { listUsers } from '../controllers/user.controller'

export const userRouter = Router()

userRouter.use(requireAuth)
userRouter.get('/', listUsers)

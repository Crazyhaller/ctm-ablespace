import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js'
import { UserRepository } from '../repositories/user.repository.js'

const repo = new UserRepository()

export async function listUsers(_req: AuthenticatedRequest, res: Response) {
  const users = await repo.findAll()
  res.json({ users })
}

import type { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils/jwt.js'

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const payload = verifyJwt(token)
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

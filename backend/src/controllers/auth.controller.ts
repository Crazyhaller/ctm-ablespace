import type { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validators/auth.schema'
import { UserRepository } from '../repositories/user.repository'
import type { AuthenticatedRequest } from '../middlewares/auth.middleware'
import { env } from '../config/env'
import type { CookieOptions } from 'express'

const authService = new AuthService()
const userRepo = new UserRepository()

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  secure: env.NODE_ENV === 'production',
}
export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  try {
    const { user, token } = await authService.register(
      parsed.data.email,
      parsed.data.password,
      parsed.data.name
    )

    res.cookie('token', token, COOKIE_OPTIONS)
    res.status(201).json({ user })
  } catch (err) {
    if ((err as Error).message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ message: 'Email already exists' })
    }
    throw err
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  try {
    const { user, token } = await authService.login(
      parsed.data.email,
      parsed.data.password
    )

    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({ user })
  } catch {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}

export function logout(_: Request, res: Response) {
  res.clearCookie('token')
  res.status(204).send()
}

export async function me(req: AuthenticatedRequest, res: Response) {
  const user = await userRepo.findById(req.userId!)
  res.json({ user })
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const parsed = updateProfileSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json(parsed.error)
  }

  const user = await userRepo.updateName(req.userId!, parsed.data.name)
  res.json({ user })
}

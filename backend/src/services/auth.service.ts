import { UserRepository } from '../repositories/user.repository'
import { hashPassword, comparePassword } from '../utils/password'
import { signJwt } from '../utils/jwt'

export class AuthService {
  private userRepo = new UserRepository()

  async register(email: string, password: string, name?: string) {
    const existing = await this.userRepo.findByEmail(email)
    if (existing) {
      throw new Error('EMAIL_ALREADY_EXISTS')
    }

    const passwordHash = await hashPassword(password)
    const user = await this.userRepo.create({
      email,
      passwordHash,
      name,
    })

    const token = signJwt({ userId: user.id })
    return { user, token }
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const token = signJwt({ userId: user.id })
    return { user, token }
  }
}

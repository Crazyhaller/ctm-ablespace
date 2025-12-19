import { prisma } from '../lib/prisma'
import type { User } from '@prisma/client'

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async create(data: {
    email: string
    passwordHash: string
    name?: string
  }): Promise<User> {
    return prisma.user.create({ data })
  }

  async updateName(id: string, name?: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { name },
    })
  }

  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  }
}

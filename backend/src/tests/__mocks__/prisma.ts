export const prisma = {
  user: {
    findUnique: jest.fn(),
  },
  task: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
}

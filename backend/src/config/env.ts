import 'dotenv/config'

function required(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

const port = Number(process.env.PORT)

export const env = {
  PORT: Number.isFinite(port) && port > 0 ? port : 3000,
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET: required('JWT_SECRET'),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
}

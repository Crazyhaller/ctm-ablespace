import { api } from './client'
import type { User } from '../types/user'

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me')
  return res.data.user
}

export async function login(data: {
  email: string
  password: string
}): Promise<User> {
  const res = await api.post('/auth/login', data)
  return res.data.user
}

export async function register(data: {
  email: string
  password: string
  name?: string
}): Promise<User> {
  const res = await api.post('/auth/register', data)
  return res.data.user
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

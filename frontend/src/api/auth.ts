import { api } from './client'
import type { User } from '../types/user'
import axios from 'axios'

export async function getMe(): Promise<User | null> {
  try {
    const res = await api.get('/auth/me')
    return res.data.user
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      return null
    }
    throw err
  }
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

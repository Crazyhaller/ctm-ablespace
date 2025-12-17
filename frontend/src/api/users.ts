import { api } from './client'

export async function getUsers() {
  const res = await api.get('/users')
  return res.data.users
}

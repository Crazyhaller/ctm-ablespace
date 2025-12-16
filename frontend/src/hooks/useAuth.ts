import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMe } from '../api/auth'
import type { User } from '../types/user'

export function useAuth() {
  return useQuery<User>({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  })
}

export function useAuthUtils() {
  const queryClient = useQueryClient()

  return {
    setUser(user: User) {
      queryClient.setQueryData(['me'], user)
    },
    clearUser() {
      queryClient.removeQueries({ queryKey: ['me'] })
    },
  }
}

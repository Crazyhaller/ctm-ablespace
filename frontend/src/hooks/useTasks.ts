import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../api/tasks'
import type { Task } from '../types/task'
import type { User } from '../types/user'

export function useTasks(user: User | null | undefined) {
  return useQuery<Task[]>({
    queryKey: ['tasks', user?.id],
    queryFn: api.getTasks,
    enabled: !!user?.id,
    retry: false,
  })
}

export function useCreateTask(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', userId] }),
  })
}

export function useUpdateTask(userId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      api.updateTask(id, data),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', userId] })
    },
  })
}

export function useDeleteTask(userId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', userId] }),
  })
}

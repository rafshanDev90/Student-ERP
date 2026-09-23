import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Category, Course, CourseFormValues } from '../data/schema'

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  categories: () => [...courseKeys.all, 'categories'] as const,
}

export function useCourses() {
  return useQuery({
    queryKey: courseKeys.lists(),
    queryFn: async () => (await apiClient.get<Course[]>('/admin/courses')).data,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: courseKeys.categories(),
    queryFn: async () =>
      (await apiClient.get<Category[]>('/categories')).data,
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CourseFormValues) =>
      apiClient.post('/admin/courses', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string
      payload: CourseFormValues
    }) => apiClient.put(`/admin/courses/${slug}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => apiClient.delete(`/admin/courses/${slug}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() })
    },
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      apiClient.post('/categories', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.categories() })
    },
  })
}
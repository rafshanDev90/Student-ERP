import { z } from 'zod'

// Mirrors the server's Course model (models/courses/Course.model.js)
export const courseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  thumbnailUrl: z.string().nullable().optional(),
  duration: z.string(),
  courseType: z.string(),
  level: z.string(),
  isPopular: z.boolean().optional(),
  status: z.string(),
  instructor: z
    .object({
      _id: z.string().optional(),
      name: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      title: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  tags: z
    .array(
      z.union([
        z.string(),
        z.object({ _id: z.string(), name: z.string(), slug: z.string() }),
      ])
    )
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Course = z.infer<typeof courseSchema>

const courseFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  thumbnailUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  duration: z.string().min(1, 'Duration is required.'),
  courseType: z.string().min(1, 'Please select a course type.'),
  level: z.string().min(1, 'Please select a level.'),
  status: z.string().min(1, 'Please select a status.'),
  isPopular: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>
export { courseFormSchema }

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string | null
}
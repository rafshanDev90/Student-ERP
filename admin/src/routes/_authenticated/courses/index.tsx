import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Courses } from '@/features/courses'
import { courseTypes, levels, statuses } from '@/features/courses/data/data'

const courseSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.enum(statuses.map((status) => status.value)))
    .optional()
    .catch([]),
  level: z
    .array(z.enum(levels.map((level) => level.value)))
    .optional()
    .catch([]),
  courseType: z
    .array(z.enum(courseTypes.map((type) => type.value)))
    .optional()
    .catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/courses/')({
  validateSearch: courseSearchSchema,
  component: Courses,
})
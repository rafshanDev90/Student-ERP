import { Archive, Globe, PenLine, Circle } from 'lucide-react'
import type { Course, CourseFormValues } from './schema'

export const courseTypes = [
  {
    label: 'Short Course',
    value: 'Short Course' as const,
  },
  {
    label: 'Full Semester',
    value: 'Full Semester' as const,
  },
  {
    label: 'Specialization',
    value: 'Specialization' as const,
  },
]

export const levels = [
  {
    label: 'Beginner',
    value: 'Beginner' as const,
  },
  {
    label: 'Intermediate',
    value: 'Intermediate' as const,
  },
  {
    label: 'Advanced',
    value: 'Advanced' as const,
  },
]

export const statuses = [
  {
    label: 'Draft',
    value: 'draft' as const,
    icon: PenLine,
  },
  {
    label: 'Published',
    value: 'published' as const,
    icon: Globe,
  },
  {
    label: 'Archived',
    value: 'archived' as const,
    icon: Archive,
  },
]

export const formDefaultValues: CourseFormValues = {
  title: '',
  description: '',
  thumbnailUrl: '',
  duration: '',
  courseType: 'Full Semester',
  level: 'Beginner',
  status: 'draft',
  isPopular: false,
  tags: [],
}

/**
 * Map a Course row coming from the API into form values.
 */
export function toFormValues(course: Course): CourseFormValues {
  return {
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl ?? '',
    duration: course.duration,
    courseType: course.courseType,
    level: course.level,
    status: course.status,
    isPopular: course.isPopular ?? false,
    tags: (course.tags ?? [])
      .map((tag) => (typeof tag === 'string' ? tag : tag?._id))
      .filter((id): id is string => !!id),
  }
}

// Small circle used for bullet details in status cells
export const statusBullet = { icon: Circle }
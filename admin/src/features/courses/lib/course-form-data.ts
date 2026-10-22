import type { CourseFormValues } from '../data/schema'

/**
 * Serialize course form values (plus an optional new image file) into a
 * multipart FormData payload for the admin course API.
 */
export function buildCourseFormData(
  data: CourseFormValues,
  imageFile?: File | null,
): FormData {
  const formData = new FormData()

  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('imageUrl', data.imageUrl ?? '')
  formData.append('duration', data.duration)
  formData.append('courseType', data.courseType)
  formData.append('level', data.level)
  formData.append('status', data.status)
  formData.append('isPopular', String(data.isPopular ?? false))
  data.tags?.forEach((tag) => formData.append('tags', tag))

  if (imageFile) {
    formData.append('image', imageFile)
  }

  return formData
}
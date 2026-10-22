/**
 * Resolve a stored image path to a renderable URL.
 *
 * Cloudinary URLs (http/https) are used as-is. Local fallback paths
 * (e.g. `/uploads/courses/...`) are prefixed with the backend API base URL.
 */
export function resolveImageUrl(url?: string | null): string | null {
  if (!url) return null

  if (/^https?:\/\//i.test(url)) return url

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
  return `${baseUrl}${url}`
}
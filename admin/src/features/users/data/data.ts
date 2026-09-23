import { GraduationCap, ShieldCheck, UserCircle2 } from 'lucide-react'

export const roles = [
  { label: 'Admin', value: 'admin', icon: ShieldCheck },
  { label: 'Teacher', value: 'teacher', icon: GraduationCap },
  { label: 'Student', value: 'student', icon: UserCircle2 },
] as const

export const roleBadges: Record<string, string> = {
  admin: 'bg-violet-100/30 text-violet-700 dark:text-violet-200 border-violet-200',
  teacher: 'bg-sky-100/30 text-sky-700 dark:text-sky-200 border-sky-200',
  student: 'bg-neutral-100/40 text-neutral-700 dark:text-neutral-200 border-neutral-300',
}

export function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
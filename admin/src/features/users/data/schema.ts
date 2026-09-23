import { z } from 'zod'

export const userRoles = ['student', 'teacher', 'admin'] as const
export type UserRole = (typeof userRoles)[number]

// Mirrors the server's User model (models/user.model.js)
export const userSchema = z.object({
  _id: z.string(),
  clerkId: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(userRoles),
  avatarUrl: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type User = z.infer<typeof userSchema>

export const userRoleFormSchema = z.object({
  role: z.enum(userRoles, {
    error: (iss) =>
      iss.input === undefined ? 'Please select a role.' : undefined,
  }),
})

export type UserRoleFormValues = z.infer<typeof userRoleFormSchema>
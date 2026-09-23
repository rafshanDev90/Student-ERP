import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/react'
import { apiClient } from '@/lib/api-client'
import { useSessionStore } from '@/stores/session-store'

type MeResponse = {
  user?: {
    _id: string
    clerkId: string
    name?: string
    email?: string
    role?: string
  }
}

/**
 * Keeps the lightweight session store in sync with the real Clerk session.
 * On sign-in it also calls the guarded /auth/me endpoint, which force-syncs
 * the Clerk user into MongoDB (creating the record if missing).
 * Rendered once, inside <ClerkProvider>.
 */
export function ClerkBridge() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const setSession = useSessionStore((s) => s.setSession)
  const updateUser = useSessionStore((s) => s.updateUser)

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn || !user) {
      setSession({ token: null, user: null })
      return
    }

    let cancelled = false

    const buildLocalUser = () => {
      const publicMetadata = (user.publicMetadata ?? {}) as Record<
        string,
        string
      >
      const unsafeMetadata = (user.unsafeMetadata ?? {}) as Record<
        string,
        string
      >

      return {
        id: user.id,
        name: user.fullName ?? user.username ?? user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        role:
          String(publicMetadata.role ?? unsafeMetadata.role ?? 'student') ||
          'student',
      }
    }

    getToken()
      .then(async (token) => {
        if (cancelled) return

        setSession({ token: token ?? null, user: buildLocalUser() })

        // Force the server to create/refresh the MongoDB user.
        try {
          if (token) {
            const res = await apiClient.get<MeResponse>('/auth/me')
            const mongoUser = res.data?.user
            if (!cancelled && mongoUser) {
              updateUser({
                id: mongoUser.clerkId ?? user.id,
                name: mongoUser.name ?? user.fullName ?? user.id,
                email: mongoUser.email ?? '',
                role: mongoUser.role ?? 'student',
              })
            }
          }
        } catch {
          // Keep the local Clerk-derived session if the sync request fails
        }
      })
      .catch(() => {
        if (!cancelled) setSession({ token: null, user: null })
      })

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, user, getToken, setSession, updateUser])

  return null
}
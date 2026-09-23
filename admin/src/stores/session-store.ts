import { create } from 'zustand'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: string
}

interface SessionState {
  token: string | null
  user: SessionUser | null
  setSession: (session: {
    token: string | null
    user: SessionUser | null
  }) => void
  updateUser: (user: SessionUser | null) => void
  clear: () => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => set({ token, user }),
  updateUser: (user) => set({ user }),
  clear: () => set({ token: null, user: null }),
}))
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { loadProfile, saveProfile, type Profile } from '../lib/storage'
import type { Plan } from '../types'

export interface AuthedUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  plan: Plan
  onboarded: boolean
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthedUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const buildUser = (authUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): AuthedUser => {
      const meta = authUser.user_metadata ?? {}
      const profile = loadProfile(authUser.id)
      return {
        id: authUser.id,
        name: (meta.full_name as string) || (meta.name as string) || authUser.email || 'Tú',
        email: authUser.email ?? '',
        avatarUrl: (meta.avatar_url as string) || (meta.picture as string) || null,
        plan: profile.plan,
        onboarded: profile.onboarded,
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ? buildUser(data.session.user) : null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? buildUser(session.user) : null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const persist = useCallback((patch: Partial<Profile>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next: AuthedUser = { ...prev, ...patch }
      saveProfile(prev.id, { plan: next.plan, onboarded: next.onboarded })
      return next
    })
  }, [])

  const completeOnboarding = useCallback(() => persist({ onboarded: true }), [persist])
  const setPlan = useCallback((plan: Plan) => persist({ plan }), [persist])

  return { user, loading, loginWithGoogle, logout, completeOnboarding, setPlan }
}

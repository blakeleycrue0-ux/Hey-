import { useCallback, useState } from 'react'
import { loadUser, saveUser, type StoredUser } from '../lib/storage'
import type { Plan } from '../types'

export const useAuth = () => {
  const [user, setUser] = useState<StoredUser | null>(() => loadUser())

  const login = useCallback((name: string, email: string) => {
    const next: StoredUser = { name: name.trim(), email: email.trim(), plan: 'free', onboarded: false }
    saveUser(next)
    setUser(next)
  }, [])

  const logout = useCallback(() => {
    saveUser(null)
    setUser(null)
  }, [])

  const completeOnboarding = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, onboarded: true }
      saveUser(next)
      return next
    })
  }, [])

  const setPlan = useCallback((plan: Plan) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, plan }
      saveUser(next)
      return next
    })
  }, [])

  return { user, login, logout, completeOnboarding, setPlan }
}

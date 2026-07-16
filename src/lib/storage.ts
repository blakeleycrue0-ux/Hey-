import type { Habit, Plan } from '../types'

const HABITS_KEY = 'loop.habits.v1'
const THEME_KEY = 'loop.theme.v1'
const USER_KEY = 'loop.user.v1'
const PREFS_KEY = 'loop.prefs.v1'

export const loadHabits = (): Habit[] => {
  try {
    const raw = localStorage.getItem(HABITS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Habit[]
  } catch {
    return []
  }
}

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export type Theme = 'light' | 'dark' | 'system'

export const loadTheme = (): Theme => {
  const raw = localStorage.getItem(THEME_KEY)
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  return 'system'
}

export const saveTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_KEY, theme)
}

export const genId = (): string =>
  crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`

/** App-specific state per signed-in user (identity itself comes from Supabase auth). */
export interface Profile {
  plan: Plan
  onboarded: boolean
}

const profileKey = (userId: string) => `${USER_KEY}.${userId}`

export const loadProfile = (userId: string): Profile => {
  try {
    const raw = localStorage.getItem(profileKey(userId))
    if (!raw) return { plan: 'free', onboarded: false }
    return JSON.parse(raw) as Profile
  } catch {
    return { plan: 'free', onboarded: false }
  }
}

export const saveProfile = (userId: string, profile: Profile): void => {
  localStorage.setItem(profileKey(userId), JSON.stringify(profile))
}

export interface Prefs {
  weekStartsOn: 'monday' | 'sunday'
  autoSortDone: boolean
}

const DEFAULT_PREFS: Prefs = { weekStartsOn: 'monday', autoSortDone: false }

export const loadPrefs = (): Prefs => {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Prefs>) }
  } catch {
    return DEFAULT_PREFS
  }
}

export const savePrefs = (prefs: Prefs): void => {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

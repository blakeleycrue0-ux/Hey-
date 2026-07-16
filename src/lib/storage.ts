import type { Habit } from '../types'

const HABITS_KEY = 'loop.habits.v1'
const THEME_KEY = 'loop.theme.v1'

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

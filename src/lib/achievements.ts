import type { Habit } from '../types'
import { longestStreak } from './streaks'

export interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
}

export const computeAchievements = (habits: Habit[]): Achievement[] => {
  const all = habits
  const bestStreak = all.reduce((best, h) => Math.max(best, longestStreak(h)), 0)
  const totalCompletions = all.reduce((sum, h) => sum + h.completions.length, 0)
  const activeCount = all.filter((h) => !h.archived).length

  return [
    { id: 'first-habit', title: 'Primeros pasos', description: 'Crea tu primer hábito', unlocked: all.length >= 1 },
    { id: 'week', title: 'Una semana', description: 'Racha de 7 días en un hábito', unlocked: bestStreak >= 7 },
    { id: 'month', title: 'Un mes', description: 'Racha de 30 días en un hábito', unlocked: bestStreak >= 30 },
    { id: 'hundred', title: 'Cien días', description: 'Racha de 100 días en un hábito', unlocked: bestStreak >= 100 },
    { id: 'year', title: 'Un año', description: 'Racha de 365 días en un hábito', unlocked: bestStreak >= 365 },
    { id: 'consistent', title: 'Constante', description: '50 hábitos completados en total', unlocked: totalCompletions >= 50 },
    { id: 'unstoppable', title: 'Imparable', description: '250 hábitos completados en total', unlocked: totalCompletions >= 250 },
    { id: 'collector', title: 'Coleccionista', description: '5 hábitos activos a la vez', unlocked: activeCount >= 5 },
  ]
}

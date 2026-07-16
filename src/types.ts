export interface Habit {
  id: string
  name: string
  icon: string
  color: HabitColor
  /** Days of week this habit is scheduled on, 0 = Sunday ... 6 = Saturday. 7 entries = every day. */
  days: number[]
  createdAt: string
  /** Set of 'YYYY-MM-DD' dates the habit was completed on. */
  completions: string[]
  archived: boolean
}

export type HabitColor =
  | 'flame'
  | 'grape'
  | 'ocean'
  | 'mint'
  | 'lemon'
  | 'rose'

export const HABIT_COLORS: Record<HabitColor, { from: string; to: string; solid: string }> = {
  flame: { from: '#ff8a5c', to: '#ff5f6d', solid: '#ff6b5e' },
  grape: { from: '#c084fc', to: '#a445ff', solid: '#a855f7' },
  ocean: { from: '#5cc9ff', to: '#3b82f6', solid: '#3b9dff' },
  mint: { from: '#5ce6b8', to: '#22c55e', solid: '#2fd48a' },
  lemon: { from: '#ffe066', to: '#ffb020', solid: '#ffc233' },
  rose: { from: '#ff8fc7', to: '#ec4899', solid: '#f45fa6' },
}

export const HABIT_ICONS = [
  '💧', '📚', '🏃', '🧘', '🥗', '💪', '😴', '✍️', '🎯', '🧹',
  '🚭', '🎸', '🧑‍💻', '🌱', '🙏', '💊', '🚴', '🎨', '☕', '📵',
]

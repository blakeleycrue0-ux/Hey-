export interface Habit {
  id: string
  name: string
  icon: HabitIconKey
  color: HabitColor
  /** Days of week this habit is scheduled on, 0 = Sunday ... 6 = Saturday. 7 entries = every day. */
  days: number[]
  createdAt: string
  /** Set of 'YYYY-MM-DD' dates the habit was completed on. */
  completions: string[]
  archived: boolean
}

export type HabitColor = 'indigo' | 'teal' | 'amber' | 'rose' | 'emerald' | 'sky' | 'violet' | 'orange'

export const HABIT_COLORS: Record<HabitColor, string> = {
  indigo: '#6366f1',
  teal: '#0d9488',
  amber: '#d97706',
  rose: '#e11d48',
  emerald: '#059669',
  sky: '#0284c7',
  violet: '#7c3aed',
  orange: '#ea580c',
}

export const BRAND = '#5B4FE8'

export type HabitIconKey =
  | 'Droplet' | 'Moon' | 'BookOpen' | 'Dumbbell' | 'PenLine' | 'Heart' | 'Pill' | 'Sun'
  | 'Footprints' | 'Brain' | 'GraduationCap' | 'Wallet' | 'Ban' | 'Coffee' | 'Smartphone'
  | 'Wine' | 'Cigarette' | 'Candy' | 'Salad' | 'Bed' | 'Timer' | 'Target' | 'Smile'
  | 'Sparkles' | 'Music' | 'Palette' | 'Users' | 'Home' | 'Leaf' | 'Bike' | 'PiggyBank'
  | 'TrendingUp' | 'Calendar' | 'Flame'

export interface SuggestedHabit {
  name: string
  icon: HabitIconKey
}

export interface HabitCategory {
  id: string
  label: string
  icon: HabitIconKey
  habits: SuggestedHabit[]
}

export const CATEGORIES: HabitCategory[] = [
  {
    id: 'popular',
    label: 'Popular',
    icon: 'Sparkles',
    habits: [
      { name: 'Drink water', icon: 'Droplet' },
      { name: 'Sleep 8 hours', icon: 'Moon' },
      { name: 'Meditate', icon: 'Brain' },
      { name: 'Read', icon: 'BookOpen' },
      { name: 'Exercise', icon: 'Dumbbell' },
      { name: 'No phone before bed', icon: 'Smartphone' },
      { name: 'Journal', icon: 'PenLine' },
    ],
  },
  {
    id: 'health',
    label: 'Salud y medicación',
    icon: 'Heart',
    habits: [
      { name: 'Take medication', icon: 'Pill' },
      { name: 'Drink water', icon: 'Droplet' },
      { name: 'Stretch', icon: 'Footprints' },
      { name: 'Take vitamins', icon: 'Pill' },
      { name: 'Sleep 8 hours', icon: 'Bed' },
    ],
  },
  {
    id: 'study',
    label: 'Estudios',
    icon: 'GraduationCap',
    habits: [
      { name: 'Study', icon: 'BookOpen' },
      { name: 'Practice a language', icon: 'GraduationCap' },
      { name: 'Review notes', icon: 'PenLine' },
      { name: 'Read', icon: 'BookOpen' },
    ],
  },
  {
    id: 'sport',
    label: 'Deporte',
    icon: 'Dumbbell',
    habits: [
      { name: 'Workout', icon: 'Dumbbell' },
      { name: 'Run', icon: 'Footprints' },
      { name: 'Yoga', icon: 'Leaf' },
      { name: 'Walk 10k steps', icon: 'Footprints' },
      { name: 'Bike ride', icon: 'Bike' },
    ],
  },
  {
    id: 'quit',
    label: 'Malos hábitos',
    icon: 'Ban',
    habits: [
      { name: 'No smoking', icon: 'Cigarette' },
      { name: 'No sugar', icon: 'Candy' },
      { name: 'No social media', icon: 'Smartphone' },
      { name: 'No alcohol', icon: 'Wine' },
      { name: 'No junk food', icon: 'Salad' },
    ],
  },
  {
    id: 'finance',
    label: 'Finanzas',
    icon: 'Wallet',
    habits: [
      { name: 'Track expenses', icon: 'Wallet' },
      { name: 'No impulse buying', icon: 'Ban' },
      { name: 'Save money', icon: 'PiggyBank' },
      { name: 'Review budget', icon: 'TrendingUp' },
    ],
  },
  {
    id: 'personal',
    label: 'Notas personales',
    icon: 'PenLine',
    habits: [
      { name: 'Journal', icon: 'PenLine' },
      { name: 'Gratitude', icon: 'Heart' },
      { name: 'Plan tomorrow', icon: 'Calendar' },
      { name: 'Reflect', icon: 'Brain' },
    ],
  },
]

export const ALL_ICONS: HabitIconKey[] = [
  'Droplet', 'Moon', 'BookOpen', 'Dumbbell', 'PenLine', 'Heart', 'Pill', 'Sun',
  'Footprints', 'Brain', 'GraduationCap', 'Wallet', 'Ban', 'Coffee', 'Smartphone',
  'Wine', 'Cigarette', 'Candy', 'Salad', 'Bed', 'Timer', 'Target', 'Smile',
  'Sparkles', 'Music', 'Palette', 'Users', 'Home', 'Leaf', 'Bike', 'PiggyBank',
  'TrendingUp', 'Calendar', 'Flame',
]

export type Plan = 'free' | 'monthly' | 'annual'

export const FREE_HABIT_LIMIT = 3

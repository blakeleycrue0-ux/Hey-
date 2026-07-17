export interface HEvent {
  id: string
  name: string
  /** Date being counted down to, 'YYYY-MM-DD'. */
  targetDate: string
  /** Date the countdown started being tracked, 'YYYY-MM-DD' — sets the dot-grid density. */
  createdAt: string
  icon: EventIconKey
  color: EventColor
  /** Birthdays, anniversaries, etc. — recalculates to the next occurrence once it passes. */
  repeatYearly: boolean
  archived: boolean
  /** Notify this many days before the target date (best-effort, only while the app is open). */
  reminderDaysBefore?: number
}

export type EventColor = 'navy' | 'teal' | 'amber' | 'rose' | 'emerald' | 'sky' | 'violet' | 'orange'

export const EVENT_COLORS: Record<EventColor, string> = {
  navy: '#22314F',
  teal: '#0d9488',
  amber: '#d97706',
  rose: '#e11d48',
  emerald: '#059669',
  sky: '#0284c7',
  violet: '#7c3aed',
  orange: '#ea580c',
}

/** Black — the app's primary chrome color (buttons, header icons, PRO badges). */
export const BRAND = '#111111'
export const BRAND_SOFT = '#2E2E2E'
export const CREAM = '#F4F1EA'

export type EventIconKey =
  | 'Cake' | 'Plane' | 'GraduationCap' | 'Heart' | 'Gift' | 'PartyPopper' | 'Briefcase'
  | 'Home' | 'Baby' | 'Gem' | 'Trophy' | 'Sun' | 'Snowflake' | 'Calendar' | 'Star'
  | 'Flag' | 'Car' | 'FileText' | 'Clock' | 'MapPin' | 'Stethoscope' | 'Music' | 'Users' | 'Sparkles'

export const ALL_ICONS: EventIconKey[] = [
  'Cake', 'Plane', 'GraduationCap', 'Heart', 'Gift', 'PartyPopper', 'Briefcase',
  'Home', 'Baby', 'Gem', 'Trophy', 'Sun', 'Snowflake', 'Calendar', 'Star',
  'Flag', 'Car', 'FileText', 'Clock', 'MapPin', 'Stethoscope', 'Music', 'Users', 'Sparkles',
]

export interface EventCategory {
  id: string
  label: string
  icon: EventIconKey
  color: EventColor
  repeatYearly: boolean
}

export const EVENT_CATEGORIES: EventCategory[] = [
  { id: 'birthday', label: 'Cumpleaños', icon: 'Cake', color: 'rose', repeatYearly: true },
  { id: 'trip', label: 'Viaje', icon: 'Plane', color: 'sky', repeatYearly: false },
  { id: 'study', label: 'Examen / estudios', icon: 'GraduationCap', color: 'violet', repeatYearly: false },
  { id: 'work', label: 'Trabajo / entrega', icon: 'Briefcase', color: 'navy', repeatYearly: false },
  { id: 'celebration', label: 'Celebración', icon: 'PartyPopper', color: 'amber', repeatYearly: false },
  { id: 'personal', label: 'Personal', icon: 'Heart', color: 'emerald', repeatYearly: false },
  { id: 'other', label: 'Otro', icon: 'Star', color: 'orange', repeatYearly: false },
]

export type Plan = 'free' | 'monthly' | 'annual'

export const FREE_EVENT_LIMIT = 3

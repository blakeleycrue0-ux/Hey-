import type { HEvent } from '../types'
import { toKey, today } from './date'

const DAY_MS = 86400000

const parseKey = (key: string): Date => new Date(`${key}T00:00:00`)

const midnight = (date: Date): Date => new Date(`${toKey(date)}T00:00:00`)

/** For yearly-repeating events, the next occurrence on or after `from`; otherwise just the target date. */
export const nextOccurrence = (event: HEvent, from: Date = today()): Date => {
  const target = parseKey(event.targetDate)
  if (!event.repeatYearly) return target
  const fromKey = toKey(from)
  const candidate = new Date(target)
  candidate.setFullYear(from.getFullYear())
  if (toKey(candidate) < fromKey) candidate.setFullYear(from.getFullYear() + 1)
  return candidate
}

/** Whole days from `from` to the event's (next) occurrence — negative once a one-off event has passed. */
export const daysUntil = (event: HEvent, from: Date = today()): number => {
  const occurrence = nextOccurrence(event, from)
  return Math.round((occurrence.getTime() - midnight(from).getTime()) / DAY_MS)
}

export const isPast = (event: HEvent, from: Date = today()): boolean =>
  !event.repeatYearly && daysUntil(event, from) < 0

/** Days between when the countdown started and the (next) occurrence — sets the dot-grid density. */
export const totalDaysSpan = (event: HEvent, from: Date = today()): number => {
  const created = parseKey(event.createdAt)
  const occurrence = nextOccurrence(event, from)
  return Math.max(1, Math.round((occurrence.getTime() - created.getTime()) / DAY_MS))
}

export interface GridInfo {
  total: number
  elapsed: number
}

/**
 * Maps a countdown to a dot grid: one dot per day when the span is short,
 * otherwise groups days into chunks so the grid never exceeds `maxDots`.
 */
export const gridDots = (event: HEvent, from: Date = today(), maxDots = 180): GridInfo => {
  const totalDays = totalDaysSpan(event, from)
  const daysLeft = Math.max(0, daysUntil(event, from))
  const elapsedDays = Math.max(0, totalDays - daysLeft)
  const chunk = Math.max(1, Math.ceil(totalDays / maxDots))
  const total = Math.max(1, Math.ceil(totalDays / chunk))
  const elapsed = Math.min(total, Math.round(elapsedDays / chunk))
  return { total, elapsed }
}

export const formatDaysLabel = (days: number): string => {
  if (days === 0) return 'Es hoy'
  if (days === 1) return 'Mañana'
  if (days === -1) return 'Ayer'
  if (days > 0) return `${days} días`
  return `Hace ${Math.abs(days)} días`
}

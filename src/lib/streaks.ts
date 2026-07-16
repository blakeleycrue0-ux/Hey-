import type { Habit } from '../types'
import { toKey, daysAgo, weekdayOf } from './date'

export const isScheduled = (habit: Habit, date: Date): boolean => {
  if (habit.days.length === 0 || habit.days.length === 7) return true
  return habit.days.includes(weekdayOf(date))
}

export const isCompletedOn = (habit: Habit, date: Date): boolean =>
  habit.completions.includes(toKey(date))

/**
 * Current streak counts consecutive scheduled days ending today (or yesterday,
 * if today is scheduled but not yet completed — so the streak isn't lost the
 * moment the clock rolls over).
 */
export const currentStreak = (habit: Habit): number => {
  let streak = 0
  let cursor = 0
  const todayScheduled = isScheduled(habit, daysAgo(0))
  const todayDone = isCompletedOn(habit, daysAgo(0))

  if (todayScheduled && !todayDone) {
    cursor = 1 // start looking from yesterday
  }

  // Walk backwards up to 3 years to avoid infinite loops on bad data.
  for (let i = 0; i < 365 * 3; i++) {
    const date = daysAgo(cursor + i)
    if (!isScheduled(habit, date)) continue
    if (isCompletedOn(habit, date)) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export const longestStreak = (habit: Habit): number => {
  if (habit.completions.length === 0) return 0
  const sorted = [...habit.completions].sort()
  const first = new Date(sorted[0])
  const span = Math.ceil((Date.now() - first.getTime()) / 86400000) + 2

  let best = 0
  let run = 0
  for (let i = span; i >= 0; i--) {
    const date = daysAgo(i)
    if (!isScheduled(habit, date)) continue
    if (isCompletedOn(habit, date)) {
      run++
      best = Math.max(best, run)
    } else {
      run = 0
    }
  }
  return best
}

export const completionRate = (habit: Habit, windowDays = 30): number => {
  let scheduled = 0
  let done = 0
  for (let i = 0; i < windowDays; i++) {
    const date = daysAgo(i)
    if (date < new Date(habit.createdAt)) continue
    if (!isScheduled(habit, date)) continue
    scheduled++
    if (isCompletedOn(habit, date)) done++
  }
  if (scheduled === 0) return 0
  return Math.round((done / scheduled) * 100)
}

/**
 * Consecutive days where every habit scheduled that day was completed
 * ("perfect days"). Days with nothing scheduled are skipped, not counted.
 */
export const perfectDayStreak = (habits: Habit[]): number => {
  const active = habits.filter((h) => !h.archived)
  if (active.length === 0) return 0

  let cursor = 0
  const todayScheduled = active.filter((h) => isScheduled(h, daysAgo(0)))
  const todayAllDone = todayScheduled.length > 0 && todayScheduled.every((h) => isCompletedOn(h, daysAgo(0)))
  if (todayScheduled.length > 0 && !todayAllDone) {
    cursor = 1
  }

  let streak = 0
  for (let i = 0; i < 365 * 3; i++) {
    const date = daysAgo(cursor + i)
    const scheduled = active.filter((h) => isScheduled(h, date))
    if (scheduled.length === 0) continue
    if (scheduled.every((h) => isCompletedOn(h, date))) {
      streak++
    } else {
      break
    }
  }
  return streak
}

const WEEKDAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

export interface WeekdayStat {
  label: string
  rate: number
}

/** Completion rate per weekday over the last 90 days, for spotting weak days. */
export const weekdayStats = (habit: Habit, windowDays = 90): WeekdayStat[] => {
  const scheduled = new Array(7).fill(0)
  const done = new Array(7).fill(0)
  for (let i = 0; i < windowDays; i++) {
    const date = daysAgo(i)
    if (date < new Date(habit.createdAt)) continue
    if (!isScheduled(habit, date)) continue
    const wd = weekdayOf(date)
    scheduled[wd]++
    if (isCompletedOn(habit, date)) done[wd]++
  }
  return WEEKDAY_LABELS.map((label, i) => ({
    label,
    rate: scheduled[i] === 0 ? 0 : Math.round((done[i] / scheduled[i]) * 100),
  }))
}

/** 0-100 score combining consistency (low variance across weekdays) and completion rate. */
export const consistencyScore = (habit: Habit): number => {
  const stats = weekdayStats(habit).filter((_, i) => habit.days.length === 0 || habit.days.length === 7 || habit.days.includes(i))
  if (stats.length === 0) return 0
  const rates = stats.map((s) => s.rate)
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length
  const variance = rates.reduce((a, b) => a + (b - avg) ** 2, 0) / rates.length
  const penalty = Math.min(30, Math.sqrt(variance) / 2)
  return Math.max(0, Math.round(avg - penalty))
}

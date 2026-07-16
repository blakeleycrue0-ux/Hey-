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

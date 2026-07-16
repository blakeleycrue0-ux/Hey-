import { useEffect, useRef } from 'react'
import type { Habit } from '../types'
import { isScheduled, isCompletedOn } from '../lib/streaks'
import { today } from '../lib/date'
import { notifyHabitReminder } from '../lib/notifications'

/**
 * Fires a local Notification when the clock hits a habit's reminder time.
 * Only works while this tab/PWA is open and in memory — there is no
 * background push here, so on iOS Safari (which doesn't support closed-app
 * web push) this is best-effort, not a guaranteed alarm.
 */
export const useReminders = (habits: Habit[]) => {
  const firedToday = useRef<Set<string>>(new Set())

  useEffect(() => {
    const check = () => {
      const now = new Date()
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const dayKey = now.toDateString()

      habits.forEach((h) => {
        if (h.archived || !h.reminderTime) return
        if (!isScheduled(h, today()) || isCompletedOn(h, today())) return
        const fireKey = `${h.id}-${dayKey}-${h.reminderTime}`
        if (h.reminderTime === hhmm && !firedToday.current.has(fireKey)) {
          firedToday.current.add(fireKey)
          notifyHabitReminder(h.name)
        }
      })
    }

    check()
    const interval = setInterval(check, 30_000)
    return () => clearInterval(interval)
  }, [habits])
}

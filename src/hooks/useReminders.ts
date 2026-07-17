import { useEffect, useRef } from 'react'
import type { HEvent } from '../types'
import { daysUntil } from '../lib/countdown'
import { notifyEventReminder } from '../lib/notifications'

/**
 * Fires a local Notification once a day when an event enters its reminder window.
 * Only works while this tab/PWA is open and in memory — there is no
 * background push here, so on iOS Safari (which doesn't support closed-app
 * web push) this is best-effort, not a guaranteed alarm.
 */
export const useReminders = (events: HEvent[]) => {
  const fired = useRef<Set<string>>(new Set())

  useEffect(() => {
    const check = () => {
      const dayKey = new Date().toDateString()

      events.forEach((e) => {
        if (e.archived || e.reminderDaysBefore === undefined) return
        const left = daysUntil(e)
        if (left < 0 || left > e.reminderDaysBefore) return
        const fireKey = `${e.id}-${dayKey}`
        if (!fired.current.has(fireKey)) {
          fired.current.add(fireKey)
          notifyEventReminder(e.name, left)
        }
      })
    }

    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [events])
}

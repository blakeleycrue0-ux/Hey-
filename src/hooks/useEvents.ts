import { useCallback, useEffect, useState } from 'react'
import type { HEvent, EventColor, EventIconKey } from '../types'
import { loadEvents, saveEvents, genId } from '../lib/storage'
import { toKey, today } from '../lib/date'

export interface NewEventInput {
  name: string
  targetDate: string
  icon: EventIconKey
  color: EventColor
  repeatYearly: boolean
}

export const useEvents = () => {
  const [events, setEvents] = useState<HEvent[]>(() => loadEvents())

  useEffect(() => {
    saveEvents(events)
  }, [events])

  const addEvent = useCallback((input: NewEventInput) => {
    const event: HEvent = {
      id: genId(),
      name: input.name.trim(),
      targetDate: input.targetDate,
      createdAt: toKey(today()),
      icon: input.icon,
      color: input.color,
      repeatYearly: input.repeatYearly,
      archived: false,
    }
    setEvents((prev) => [...prev, event])
    return event
  }, [])

  const updateEvent = useCallback((id: string, patch: Partial<NewEventInput>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const setArchived = useCallback((id: string, archived: boolean) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, archived } : e)))
  }, [])

  const replaceAll = useCallback((next: HEvent[]) => {
    setEvents(next)
  }, [])

  const setReminderDaysBefore = useCallback((id: string, days: number | undefined) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, reminderDaysBefore: days } : e)))
  }, [])

  return { events, addEvent, updateEvent, deleteEvent, setArchived, replaceAll, setReminderDaysBefore }
}

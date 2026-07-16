import { useCallback, useEffect, useState } from 'react'
import type { Habit, HabitColor, HabitIconKey } from '../types'
import { loadHabits, saveHabits, genId } from '../lib/storage'

export interface NewHabitInput {
  name: string
  icon: HabitIconKey
  color: HabitColor
  days: number[]
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits())

  useEffect(() => {
    saveHabits(habits)
  }, [habits])

  const addHabit = useCallback((input: NewHabitInput) => {
    const habit: Habit = {
      id: genId(),
      name: input.name.trim(),
      icon: input.icon,
      color: input.color,
      days: input.days,
      createdAt: new Date().toISOString(),
      completions: [],
      archived: false,
    }
    setHabits((prev) => [...prev, habit])
    return habit
  }, [])

  const updateHabit = useCallback((id: string, patch: Partial<NewHabitInput>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)))
  }, [])

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const setArchived = useCallback((id: string, archived: boolean) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, archived } : h)))
  }, [])

  const replaceAll = useCallback((next: Habit[]) => {
    setHabits(next)
  }, [])

  const setPausedUntil = useCallback((id: string, dateKey: string | undefined) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, pausedUntil: dateKey } : h)))
  }, [])

  const setReminderTime = useCallback((id: string, time: string | undefined) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, reminderTime: time } : h)))
  }, [])

  const setNote = useCallback((id: string, dateKey: string, note: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const notes = { ...h.notes }
        if (note.trim()) notes[dateKey] = note.trim()
        else delete notes[dateKey]
        return { ...h, notes }
      }),
    )
  }, [])

  const toggleDate = useCallback((id: string, dateKey: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const done = h.completions.includes(dateKey)
        return {
          ...h,
          completions: done ? h.completions.filter((d) => d !== dateKey) : [...h.completions, dateKey],
        }
      }),
    )
  }, [])

  return { habits, addHabit, updateHabit, deleteHabit, toggleDate, setArchived, replaceAll, setPausedUntil, setNote, setReminderTime }
}

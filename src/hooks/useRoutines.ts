import { useCallback, useEffect, useState } from 'react'
import type { HabitIconKey } from '../types'
import { genId } from '../lib/storage'

export interface Routine {
  id: string
  name: string
  icon: HabitIconKey
  habitIds: string[]
}

const ROUTINES_KEY = 'loop.routines.v1'

const loadRoutines = (): Routine[] => {
  try {
    const raw = localStorage.getItem(ROUTINES_KEY)
    return raw ? (JSON.parse(raw) as Routine[]) : []
  } catch {
    return []
  }
}

const saveRoutines = (routines: Routine[]): void => {
  localStorage.setItem(ROUTINES_KEY, JSON.stringify(routines))
}

export interface NewRoutineInput {
  name: string
  icon: HabitIconKey
  habitIds: string[]
}

export const useRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>(() => loadRoutines())

  useEffect(() => {
    saveRoutines(routines)
  }, [routines])

  const addRoutine = useCallback((input: NewRoutineInput) => {
    setRoutines((prev) => [...prev, { id: genId(), ...input }])
  }, [])

  const updateRoutine = useCallback((id: string, input: NewRoutineInput) => {
    setRoutines((prev) => prev.map((r) => (r.id === id ? { ...r, ...input } : r)))
  }, [])

  const deleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }, [])

  return { routines, addRoutine, updateRoutine, deleteRoutine }
}

import { Check } from 'lucide-react'
import { BRAND, type Habit } from '../types'
import { HabitIcon } from '../lib/icons'
import { isCompletedOn } from '../lib/streaks'
import type { Routine } from '../hooks/useRoutines'

interface Props {
  routines: Routine[]
  habits: Habit[]
  date: Date
  onComplete: (habitIds: string[]) => void
}

export const RoutineChips = ({ routines, habits, date, onComplete }: Props) => {
  if (routines.length === 0) return null

  return (
    <div className="mb-3 flex gap-2 overflow-x-auto px-5 pb-1">
      {routines.map((r) => {
        const included = habits.filter((h) => r.habitIds.includes(h.id) && !h.archived)
        if (included.length === 0) return null
        const done = included.filter((h) => isCompletedOn(h, date)).length
        const allDone = done === included.length

        return (
          <button
            key={r.id}
            onClick={() => onComplete(included.map((h) => h.id))}
            className="flex shrink-0 items-center gap-2 rounded-2xl border-2 px-3 py-2"
            style={{ borderColor: allDone ? BRAND : 'rgba(128,128,128,0.18)', background: allDone ? `${BRAND}0d` : 'white' }}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: BRAND }}>
              {allDone ? <Check size={14} /> : <HabitIcon name={r.icon} size={14} />}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{r.name}</p>
              <p className="text-[10px] text-zinc-400">
                {done}/{included.length}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

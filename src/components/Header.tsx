import type { Habit } from '../types'
import { BRAND } from '../types'
import { isCompletedOn, isScheduled } from '../lib/streaks'
import { today } from '../lib/date'

interface Props {
  habits: Habit[]
  title: string
}

export const Header = ({ habits, title }: Props) => {
  const scheduled = habits.filter((h) => isScheduled(h, today()))
  const done = scheduled.filter((h) => isCompletedOn(h, today()))
  const pct = scheduled.length ? Math.round((done.length / scheduled.length) * 100) : 0

  return (
    <div className="px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        {scheduled.length > 0 && (
          <div className="relative flex h-11 w-11 items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-200 dark:text-zinc-800" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke={BRAND}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{pct}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

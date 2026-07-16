import { motion } from 'framer-motion'
import { Check, Flame } from 'lucide-react'
import type { Habit } from '../types'
import { HABIT_COLORS } from '../types'
import { HabitIcon } from '../lib/icons'
import { currentStreak, isScheduled } from '../lib/streaks'
import { toKey } from '../lib/date'

interface Props {
  habit: Habit
  date: Date
  onToggle: (id: string, e: React.MouseEvent) => void
  onOpen: (habit: Habit) => void
}

export const HabitCard = ({ habit, date, onToggle, onOpen }: Props) => {
  const color = HABIT_COLORS[habit.color]
  const done = habit.completions.includes(toKey(date))
  const scheduled = isScheduled(habit, date)
  const streak = currentStreak(habit)

  return (
    <motion.div
      layout
      className="flex items-center gap-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-3 shadow-sm"
    >
      <button
        onClick={() => onOpen(habit)}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: color }}
        >
          <HabitIcon name={habit.icon} size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{habit.name}</p>
          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 font-medium" style={{ color }}>
                <Flame size={12} strokeWidth={2.5} />
                {streak}
              </span>
            )}
            {streak === 0 && <span>{scheduled ? 'Not started' : 'Not today'}</span>}
          </div>
        </div>
      </button>

      <motion.button
        whileTap={{ scale: 0.85 }}
        disabled={!scheduled}
        onClick={(e) => onToggle(habit.id, e)}
        aria-label={done ? 'Mark not done' : 'Mark done'}
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-30"
        style={{
          borderColor: done ? color : 'rgba(128,128,128,0.35)',
          background: done ? color : 'transparent',
        }}
      >
        {done && (
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <Check size={18} strokeWidth={3} className="text-white" />
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  )
}

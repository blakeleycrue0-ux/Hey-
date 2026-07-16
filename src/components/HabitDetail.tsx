import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Flame, Pencil, Target, Trophy } from 'lucide-react'
import type { Habit, Plan } from '../types'
import { HABIT_COLORS } from '../types'
import { HabitIcon } from '../lib/icons'
import { currentStreak, longestStreak, completionRate } from '../lib/streaks'
import { Heatmap } from './Heatmap'
import { ProInsights } from './ProInsights'

interface Props {
  habit: Habit | null
  plan: Plan
  onClose: () => void
  onEdit: (habit: Habit) => void
  onUpgrade: () => void
}

export const HabitDetail = ({ habit, plan, onClose, onEdit, onUpgrade }: Props) => {
  const color = habit ? HABIT_COLORS[habit.color] : null

  return (
    <AnimatePresence>
      {habit && color && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          className="fixed inset-0 z-50 mx-auto max-w-md bg-zinc-50 dark:bg-zinc-950 overflow-y-auto"
        >
          <div className="px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-8" style={{ background: color }}>
            <div className="flex items-center justify-between">
              <button onClick={onClose} className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur">
                <ChevronLeft size={22} />
              </button>
              <button onClick={() => onEdit(habit)} className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur">
                <Pencil size={18} />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur">
                <HabitIcon name={habit.icon} size={26} />
              </div>
              <h1 className="text-2xl font-bold text-white">{habit.name}</h1>
            </div>
          </div>

          <div className="-mt-5 rounded-t-3xl bg-zinc-50 dark:bg-zinc-950 px-5 pt-5 pb-10">
            <div className="grid grid-cols-3 gap-2">
              <StatTile icon={<Flame size={16} />} label="Streak" value={currentStreak(habit)} color={color} />
              <StatTile icon={<Trophy size={16} />} label="Best" value={longestStreak(habit)} color={color} />
              <StatTile icon={<Target size={16} />} label="30-day" value={`${completionRate(habit)}%`} color={color} />
            </div>

            <div className="mt-6 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4">
              <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Last 18 weeks</p>
              <Heatmap habit={habit} />
            </div>

            <div className="mt-4">
              <ProInsights habit={habit} plan={plan} onUpgrade={onUpgrade} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const StatTile = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
  <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-3 text-center">
    <div className="mb-1 flex items-center justify-center gap-1" style={{ color }}>
      {icon}
      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</p>
  </div>
)

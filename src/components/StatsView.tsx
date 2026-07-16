import { Flame, Trophy, Target, Layers } from 'lucide-react'
import type { Habit } from '../types'
import { HABIT_COLORS } from '../types'
import { currentStreak, longestStreak, completionRate } from '../lib/streaks'
import { Heatmap } from './Heatmap'

interface Props {
  habits: Habit[]
  onOpen: (habit: Habit) => void
}

export const StatsView = ({ habits, onOpen }: Props) => {
  const activeStreaks = habits.reduce((sum, h) => sum + (currentStreak(h) > 0 ? 1 : 0), 0)
  const bestEver = habits.reduce((best, h) => Math.max(best, longestStreak(h)), 0)
  const avgRate = habits.length
    ? Math.round(habits.reduce((sum, h) => sum + completionRate(h), 0) / habits.length)
    : 0

  return (
    <div className="px-4 pt-2 pb-24">
      <div className="grid grid-cols-3 gap-2">
        <SummaryTile icon={<Flame size={16} />} label="Active streaks" value={activeStreaks} />
        <SummaryTile icon={<Trophy size={16} />} label="Best streak" value={bestEver} />
        <SummaryTile icon={<Target size={16} />} label="Avg. rate" value={`${avgRate}%`} />
      </div>

      {habits.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center text-zinc-400">
          <Layers size={32} className="mb-2 opacity-40" />
          <p className="text-sm">Add a habit to see your stats here.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {habits.map((h) => {
            const palette = HABIT_COLORS[h.color]
            return (
              <button
                key={h.id}
                onClick={() => onOpen(h)}
                className="w-full rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4 text-left"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-base"
                    style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}
                  >
                    {h.icon}
                  </div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{h.name}</p>
                  <span className="ml-auto flex items-center gap-1 text-xs font-medium" style={{ color: palette.solid }}>
                    <Flame size={12} />
                    {currentStreak(h)}
                  </span>
                </div>
                <Heatmap habit={h} weeks={14} />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const SummaryTile = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-3 text-center">
    <div className="mb-1 flex items-center justify-center gap-1 text-violet-500">
      {icon}
      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</p>
  </div>
)

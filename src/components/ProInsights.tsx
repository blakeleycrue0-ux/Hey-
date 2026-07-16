import { Lock, Sparkles } from 'lucide-react'
import type { Habit, Plan } from '../types'
import { HABIT_COLORS, BRAND } from '../types'
import { weekdayStats, consistencyScore } from '../lib/streaks'

interface Props {
  habit: Habit
  plan: Plan
  onUpgrade: () => void
}

export const ProInsights = ({ habit, plan, onUpgrade }: Props) => {
  const color = HABIT_COLORS[habit.color]
  const stats = weekdayStats(habit)
  const score = consistencyScore(habit)
  const isPro = plan !== 'free'

  return (
    <div className="relative rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4 overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Insights avanzados</p>
        {!isPro && (
          <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: BRAND }}>
            <Sparkles size={10} />
            PRO
          </span>
        )}
      </div>

      <div className={isPro ? '' : 'pointer-events-none select-none blur-[6px]'}>
        <div className="mb-4 flex items-end justify-between gap-1.5 h-24">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-16 w-full items-end rounded-md bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="w-full rounded-md" style={{ height: `${Math.max(4, s.rate)}%`, background: color }} />
              </div>
              <span className="text-[10px] text-zinc-400">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-white/[0.03] p-3">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Puntuación de consistencia</span>
          <span className="text-lg font-bold" style={{ color }}>{score}/100</span>
        </div>
      </div>

      {!isPro && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/40 dark:bg-zinc-900/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: BRAND }}>
            <Lock size={16} />
          </div>
          <button onClick={onUpgrade} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow" style={{ background: BRAND }}>
            Desbloquear con Pro
          </button>
        </div>
      )}
    </div>
  )
}

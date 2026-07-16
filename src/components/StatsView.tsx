import { Flame, Trophy, Target, Layers, Lock, Sparkles } from 'lucide-react'
import type { Habit, Plan } from '../types'
import { HABIT_COLORS, BRAND } from '../types'
import { HabitIcon } from '../lib/icons'
import { currentStreak, longestStreak, completionRate, weekdayStats } from '../lib/streaks'
import { Heatmap } from './Heatmap'

interface Props {
  habits: Habit[]
  plan: Plan
  onOpen: (habit: Habit) => void
  onUpgrade: () => void
}

export const StatsView = ({ habits, plan, onOpen, onUpgrade }: Props) => {
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

      {habits.length > 0 && <OverallInsights habits={habits} plan={plan} onUpgrade={onUpgrade} />}

      {habits.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center text-zinc-400">
          <Layers size={32} className="mb-2 opacity-40" />
          <p className="text-sm">Add a habit to see your stats here.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {habits.map((h) => {
            const color = HABIT_COLORS[h.color]
            return (
              <button
                key={h.id}
                onClick={() => onOpen(h)}
                className="w-full rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4 text-left"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}1a`, color }}>
                    <HabitIcon name={h.icon} size={16} />
                  </div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{h.name}</p>
                  <span className="ml-auto flex items-center gap-1 text-xs font-medium" style={{ color }}>
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

const OverallInsights = ({ habits, plan, onUpgrade }: { habits: Habit[]; plan: Plan; onUpgrade: () => void }) => {
  const isPro = plan !== 'free'
  const combined = [0, 0, 0, 0, 0, 0, 0]
  const counts = [0, 0, 0, 0, 0, 0, 0]
  habits.forEach((h) => {
    weekdayStats(h).forEach((s, i) => {
      combined[i] += s.rate
      counts[i]++
    })
  })
  const avgByDay = combined.map((v, i) => (counts[i] ? Math.round(v / counts[i]) : 0))
  const bestDayIdx = avgByDay.indexOf(Math.max(...avgByDay))
  const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

  return (
    <div className="relative mt-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4 overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tu semana</p>
        {!isPro && (
          <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: BRAND }}>
            <Sparkles size={10} />
            PRO
          </span>
        )}
      </div>

      <div className={isPro ? '' : 'pointer-events-none select-none blur-[6px]'}>
        <p className="mb-3 text-sm text-zinc-700 dark:text-zinc-300">
          Tu día más constante es el <span className="font-semibold">{dayNames[bestDayIdx]}</span>.
        </p>
        <div className="flex items-end justify-between gap-1.5 h-20">
          {avgByDay.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-14 w-full items-end rounded-md bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div className="w-full rounded-md" style={{ height: `${Math.max(4, v)}%`, background: BRAND }} />
              </div>
              <span className="text-[10px] text-zinc-400">{['D', 'L', 'M', 'X', 'J', 'V', 'S'][i]}</span>
            </div>
          ))}
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

const SummaryTile = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-3 text-center">
    <div className="mb-1 flex items-center justify-center gap-1" style={{ color: BRAND }}>
      {icon}
      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{label}</p>
  </div>
)

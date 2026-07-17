import { CalendarClock, Hourglass, Layers, Lock, Sparkles } from 'lucide-react'
import type { HEvent, Plan } from '../types'
import { BRAND } from '../types'
import { daysUntil } from '../lib/countdown'
import { EventIcon } from '../lib/icons'
import { EventCard } from './EventCard'

interface Props {
  events: HEvent[]
  plan: Plan
  onOpen: (event: HEvent) => void
  onUpgrade: () => void
}

export const StatsView = ({ events, plan, onOpen, onUpgrade }: Props) => {
  const upcoming = events.filter((e) => daysUntil(e) >= 0)
  const closest = upcoming.length ? Math.min(...upcoming.map((e) => daysUntil(e))) : 0
  const farthest = upcoming.length ? Math.max(...upcoming.map((e) => daysUntil(e))) : 0
  const sorted = [...events].sort((a, b) => daysUntil(a) - daysUntil(b))

  return (
    <div className="px-4 pt-2 pb-24">
      <div className="grid grid-cols-3 gap-2">
        <SummaryTile icon={<Layers size={16} />} label="Activos" value={events.length} />
        <SummaryTile icon={<Hourglass size={16} />} label="Más cercano" value={upcoming.length ? closest : '—'} />
        <SummaryTile icon={<CalendarClock size={16} />} label="Más lejano" value={upcoming.length ? farthest : '—'} />
      </div>

      {events.length > 0 && <CategoryInsight events={events} plan={plan} onUpgrade={onUpgrade} />}

      {events.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center text-zinc-400">
          <Layers size={32} className="mb-2 opacity-40" />
          <p className="text-sm">Añade un evento para ver tu resumen aquí.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {sorted.map((e) => (
            <EventCard key={e.id} event={e} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  )
}

const CategoryInsight = ({ events, plan, onUpgrade }: { events: HEvent[]; plan: Plan; onUpgrade: () => void }) => {
  const isPro = plan !== 'free'
  const counts = new Map<string, number>()
  events.forEach((e) => counts.set(e.icon, (counts.get(e.icon) ?? 0) + 1))
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const max = Math.max(1, ...top.map(([, c]) => c))

  return (
    <div className="relative mt-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4 overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Qué sigues más</p>
        {!isPro && (
          <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: BRAND }}>
            <Sparkles size={10} />
            PRO
          </span>
        )}
      </div>

      <div className={isPro ? 'space-y-2.5' : 'space-y-2.5 pointer-events-none select-none blur-[6px]'}>
        {top.map(([icon, count]) => (
          <div key={icon} className="flex items-center gap-3">
            <EventIcon name={icon as HEvent['icon']} size={16} className="shrink-0 text-zinc-500 dark:text-zinc-400" />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: BRAND }} />
            </div>
            <span className="w-4 text-right text-xs text-zinc-400">{count}</span>
          </div>
        ))}
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

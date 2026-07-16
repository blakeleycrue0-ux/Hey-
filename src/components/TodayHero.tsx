import { useState } from 'react'
import { Flame, Share2 } from 'lucide-react'
import { BRAND, type Habit } from '../types'
import { perfectDayStreak, isScheduled, isCompletedOn } from '../lib/streaks'
import { today } from '../lib/date'
import { shareStreakImage } from '../lib/shareImage'

interface Props {
  habits: Habit[]
}

export const TodayHero = ({ habits }: Props) => {
  const [sharing, setSharing] = useState(false)
  const active = habits.filter((h) => !h.archived)
  const scheduledToday = active.filter((h) => isScheduled(h, today()))
  const doneToday = scheduledToday.filter((h) => isCompletedOn(h, today()))
  const pct = scheduledToday.length ? Math.round((doneToday.length / scheduledToday.length) * 100) : 0
  const streak = perfectDayStreak(habits)

  if (active.length === 0) return null

  const message =
    scheduledToday.length === 0
      ? 'Nada programado por hoy.'
      : pct === 100
        ? 'Día perfecto. Sigue así.'
        : doneToday.length === 0
          ? 'Aún no has empezado hoy.'
          : `${doneToday.length} de ${scheduledToday.length} hábitos hechos.`

  const handleShare = async () => {
    if (sharing) return
    setSharing(true)
    try {
      await shareStreakImage(habits)
    } catch {
      // user cancelled the share sheet or the browser blocked it — nothing to recover
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="mx-5 mb-3 overflow-hidden rounded-2xl text-white" style={{ background: BRAND }}>
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10">
          <Flame size={26} className={streak > 0 ? 'text-white' : 'text-white/40'} fill={streak > 0 ? 'currentColor' : 'none'} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-extrabold leading-none">
            {streak} {streak === 1 ? 'día' : 'días'}
          </p>
          <p className="mt-1 text-xs text-white/60">Racha de días perfectos</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">{pct}%</p>
          <p className="text-[11px] text-white/60">hoy</p>
        </div>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 disabled:opacity-50"
          aria-label="Compartir racha"
        >
          <Share2 size={16} />
        </button>
      </div>
      {scheduledToday.length > 0 && (
        <div className="h-1 w-full bg-white/10">
          <div className="h-full bg-white transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
      <p className="px-4 py-2 text-xs text-white/70">{message}</p>
    </div>
  )
}

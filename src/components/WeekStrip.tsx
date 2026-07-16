import { BRAND } from '../types'
import { isSameDay, toKey } from '../lib/date'
import type { Prefs } from '../lib/storage'

interface Props {
  selected: Date
  onSelect: (date: Date) => void
  weekStartsOn: Prefs['weekStartsOn']
}

const DAY_LETTERS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

const startOfWeek = (date: Date, weekStartsOn: Prefs['weekStartsOn']): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = weekStartsOn === 'sunday' ? -day : day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export const WeekStrip = ({ selected, onSelect, weekStartsOn }: Props) => {
  const start = startOfWeek(new Date(), weekStartsOn)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
  const now = new Date()

  return (
    <div className="px-5 pb-1">
      <div className="flex justify-between">
        {days.map((d) => {
          const isSelected = isSameDay(d, selected)
          const isToday = isSameDay(d, now)
          const isFuture = d > now && !isToday
          return (
            <button
              key={toKey(d)}
              onClick={() => !isFuture && onSelect(d)}
              disabled={isFuture}
              className="flex flex-col items-center gap-1.5 disabled:opacity-30"
            >
              <span className="text-[10px] font-medium text-zinc-400">{DAY_LETTERS[d.getDay()]}</span>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors"
                style={{
                  background: isSelected ? BRAND : 'transparent',
                  color: isSelected ? 'white' : isToday ? BRAND : undefined,
                }}
              >
                {d.getDate()}
              </span>
            </button>
          )
        })}
      </div>
      {isSameDay(selected, now) ? (
        <p className="mt-2 text-center text-xs font-medium text-zinc-400">Hoy</p>
      ) : (
        <p className="mt-2 text-center text-xs font-medium text-zinc-400">
          {selected.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
        </p>
      )}
    </div>
  )
}

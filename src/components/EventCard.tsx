import { motion } from 'framer-motion'
import type { HEvent } from '../types'
import { EVENT_COLORS } from '../types'
import { EventIcon } from '../lib/icons'
import { daysUntil, gridDots, formatDaysLabel } from '../lib/countdown'
import { DotGrid } from './DotGrid'

interface Props {
  event: HEvent
  onOpen: (event: HEvent) => void
}

export const EventCard = ({ event, onOpen }: Props) => {
  const color = EVENT_COLORS[event.color]
  const days = daysUntil(event)
  const past = days < 0
  const { total, elapsed } = gridDots(event, new Date(), 24)

  return (
    <motion.button
      layout
      onClick={() => onOpen(event)}
      className="flex w-full items-center gap-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-3 text-left shadow-sm"
      style={{ opacity: past ? 0.55 : 1 }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ background: color }}
      >
        <EventIcon name={event.icon} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{event.name}</p>
        <p className="text-xs font-medium" style={{ color }}>
          {formatDaysLabel(days)}
        </p>
      </div>
      <div className="shrink-0">
        <DotGrid total={total} elapsed={elapsed} color={color} size={3.5} gap={2.5} columns={6} />
      </div>
    </motion.button>
  )
}

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import type { HEvent } from '../types'
import { EVENT_COLORS } from '../types'
import { EventIcon } from '../lib/icons'
import { daysUntil, gridDots } from '../lib/countdown'
import { shareEventImage } from '../lib/shareImage'
import { DotGrid } from './DotGrid'

interface Props {
  event: HEvent
  onOpen: (event: HEvent) => void
}

export const EventHero = ({ event, onOpen }: Props) => {
  const [sharing, setSharing] = useState(false)
  const color = EVENT_COLORS[event.color]
  const days = daysUntil(event)
  const { total, elapsed } = gridDots(event, new Date(), 120)

  const handleShare = async () => {
    if (sharing) return
    setSharing(true)
    try {
      await shareEventImage(event)
    } catch {
      // user cancelled the share sheet or the browser blocked it — nothing to recover
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="mx-5 mb-3 overflow-hidden rounded-2xl text-white" style={{ background: color }}>
      <button onClick={() => onOpen(event)} className="flex w-full items-center gap-3 p-4 pb-3 text-left">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <EventIcon name={event.icon} size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white/80">{event.name}</p>
          <p className="text-2xl font-extrabold leading-tight">
            {days === 0 ? 'Es hoy' : days > 0 ? `${days} días` : `Hace ${Math.abs(days)} días`}
          </p>
        </div>
        <span
          onClick={(e) => {
            e.stopPropagation()
            handleShare()
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15"
          role="button"
          aria-label="Compartir cuenta atrás"
          aria-disabled={sharing}
        >
          <Share2 size={16} />
        </span>
      </button>
      <div className="px-4 pb-4">
        <DotGrid total={total} elapsed={elapsed} color="#ffffff" size={4.5} gap={3.5} />
      </div>
    </div>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Pencil, Repeat, Share2 } from 'lucide-react'
import { useState } from 'react'
import type { HEvent } from '../types'
import { EVENT_COLORS } from '../types'
import { EventIcon } from '../lib/icons'
import { daysUntil, gridDots } from '../lib/countdown'
import { shareEventImage } from '../lib/shareImage'
import { DotGrid } from './DotGrid'

interface Props {
  event: HEvent | null
  onClose: () => void
  onEdit: (event: HEvent) => void
}

export const EventDetail = ({ event, onClose, onEdit }: Props) => {
  const [sharing, setSharing] = useState(false)
  const color = event ? EVENT_COLORS[event.color] : null
  const days = event ? daysUntil(event) : 0
  const { total, elapsed } = event ? gridDots(event, new Date(), 200) : { total: 0, elapsed: 0 }

  const handleShare = async () => {
    if (!event || sharing) return
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
    <AnimatePresence>
      {event && color && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          className="fixed inset-0 z-50 mx-auto max-w-md overflow-y-auto text-white"
          style={{ background: color }}
        >
          <div className="px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-6">
            <div className="flex items-center justify-between">
              <button onClick={onClose} className="rounded-full bg-white/15 p-1.5 backdrop-blur">
                <ChevronLeft size={22} />
              </button>
              <div className="flex gap-2">
                <button onClick={handleShare} disabled={sharing} className="rounded-full bg-white/15 p-1.5 backdrop-blur disabled:opacity-50">
                  <Share2 size={18} />
                </button>
                <button onClick={() => onEdit(event)} className="rounded-full bg-white/15 p-1.5 backdrop-blur">
                  <Pencil size={18} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <EventIcon name={event.icon} size={26} />
              </div>
              <h1 className="text-xl font-bold">{event.name}</h1>
              <p className="mt-4 text-6xl font-extrabold leading-none tabular-nums">{Math.abs(days)}</p>
              <p className="mt-2 text-sm font-medium text-white/70">
                {days === 0 ? 'días — ¡es hoy!' : days > 0 ? 'días para llegar' : 'días desde que pasó'}
              </p>
              {event.repeatYearly && (
                <p className="mt-2 flex items-center gap-1 text-xs text-white/60">
                  <Repeat size={12} />
                  Se repite cada año
                </p>
              )}
            </div>
          </div>

          <div className="rounded-t-3xl bg-cream dark:bg-zinc-950 px-5 pt-6 pb-10 text-zinc-900 dark:text-zinc-100">
            <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-5">
              <p className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Cuenta atrás</p>
              <DotGrid total={total} elapsed={elapsed} color={color} size={7} gap={5} />
            </div>

            <div className="mt-4 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Fecha</p>
              <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {new Date(`${event.targetDate}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {event.reminderDaysBefore !== undefined && (
              <p className="mt-3 text-center text-xs text-zinc-400">
                Recordatorio {event.reminderDaysBefore === 1 ? '1 día antes' : `${event.reminderDaysBefore} días antes`}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Archive, Bell, Trash2, X } from 'lucide-react'
import type { HEvent, EventColor, EventIconKey } from '../types'
import { EVENT_COLORS, ALL_ICONS, EVENT_CATEGORIES, BRAND } from '../types'
import { EventIcon } from '../lib/icons'
import type { NewEventInput } from '../hooks/useEvents'
import { toKey, today } from '../lib/date'

const REMINDER_OPTIONS = [
  { label: 'Nunca', value: undefined },
  { label: '1 día antes', value: 1 },
  { label: '3 días antes', value: 3 },
  { label: '1 semana antes', value: 7 },
]

interface Props {
  open: boolean
  editing: HEvent | null
  onClose: () => void
  onSave: (input: NewEventInput, reminderDaysBefore: number | undefined) => void
  onDelete: (id: string) => void
  onArchive: (id: string) => void
}

export const AddEventSheet = ({ open, editing, onClose, onSave, onDelete, onArchive }: Props) => {
  const [name, setName] = useState('')
  const [date, setDate] = useState(() => toKey(today()))
  const [icon, setIcon] = useState<EventIconKey>(ALL_ICONS[0])
  const [color, setColor] = useState<EventColor>('navy')
  const [repeatYearly, setRepeatYearly] = useState(false)
  const [reminderDaysBefore, setReminderDaysBefore] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '')
      setDate(editing?.targetDate ?? toKey(today()))
      setIcon(editing?.icon ?? ALL_ICONS[0])
      setColor(editing?.color ?? 'navy')
      setRepeatYearly(editing?.repeatYearly ?? false)
      setReminderDaysBefore(editing?.reminderDaysBefore)
    }
  }, [open, editing])

  const handleSave = () => {
    if (!name.trim() || !date) return
    onSave({ name, targetDate: date, icon, color, repeatYearly }, reminderDaysBefore)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white dark:bg-zinc-900 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {editing ? 'Editar evento' : 'Nuevo evento'}
              </h2>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            {!editing && (
              <>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Categoría</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setIcon(cat.icon)
                        setColor(cat.color)
                        setRepeatYearly(cat.repeatYearly)
                      }}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background: icon === cat.icon && color === cat.color ? EVENT_COLORS[cat.color] : 'rgba(128,128,128,0.08)',
                        color: icon === cat.icon && color === cat.color ? 'white' : 'rgba(128,128,128,0.9)',
                      }}
                    >
                      <EventIcon name={cat.icon} size={13} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <input
              autoFocus={!editing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="p. ej. Cumpleaños de Ana"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-base text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2"
              style={{ ['--tw-ring-color' as string]: BRAND }}
            />

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Fecha</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-base text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2"
              style={{ ['--tw-ring-color' as string]: BRAND }}
            />

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
              <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">Se repite cada año</span>
              <button
                onClick={() => setRepeatYearly((v) => !v)}
                className="relative h-6 w-10 shrink-0 rounded-full transition-colors"
                style={{ background: repeatYearly ? EVENT_COLORS[color] : 'rgba(128,128,128,0.3)' }}
                aria-pressed={repeatYearly}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                  style={{ transform: repeatYearly ? 'translateX(18px)' : 'translateX(2px)' }}
                />
              </button>
            </div>

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Icono</p>
            <div className="flex flex-wrap gap-2">
              {ALL_ICONS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform"
                  style={{
                    background: i === icon ? EVENT_COLORS[color] : 'rgba(128,128,128,0.08)',
                    color: i === icon ? 'white' : 'rgba(128,128,128,0.8)',
                    transform: i === icon ? 'scale(1.08)' : undefined,
                  }}
                >
                  <EventIcon name={i} size={18} />
                </button>
              ))}
            </div>

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Color</p>
            <div className="flex gap-2">
              {(Object.keys(EVENT_COLORS) as EventColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="h-8 w-8 rounded-full transition-transform"
                  style={{
                    background: EVENT_COLORS[c],
                    transform: c === color ? 'scale(1.15)' : undefined,
                    boxShadow: c === color ? `0 0 0 2px white, 0 0 0 4px ${EVENT_COLORS[c]}` : undefined,
                  }}
                />
              ))}
            </div>

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Recordatorio</p>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
              <Bell size={18} className="shrink-0 text-zinc-400" />
              <div className="flex flex-1 flex-wrap gap-1.5">
                {REMINDER_OPTIONS.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => setReminderDaysBefore(o.value)}
                    className="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
                    style={{
                      background: reminderDaysBefore === o.value ? EVENT_COLORS[color] : 'rgba(128,128,128,0.08)',
                      color: reminderDaysBefore === o.value ? 'white' : 'rgba(128,128,128,0.9)',
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            {reminderDaysBefore !== undefined && (
              <p className="mt-1.5 text-[11px] text-zinc-400">
                Solo avisa mientras Loop esté abierto en el fondo del navegador — en iPhone Safari no hay notificaciones reales en segundo plano sin un servidor.
              </p>
            )}

            <div className="mt-6 flex gap-2">
              {editing && (
                <>
                  <button
                    onClick={() => {
                      onArchive(editing.id)
                      onClose()
                    }}
                    className="flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-zinc-500"
                    aria-label="Archivar evento"
                  >
                    <Archive size={18} />
                  </button>
                  <button
                    onClick={() => {
                      onDelete(editing.id)
                      onClose()
                    }}
                    className="flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900 px-4 py-3 text-red-500"
                    aria-label="Eliminar evento"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
              <button
                onClick={handleSave}
                disabled={!name.trim() || !date}
                className="flex-1 rounded-xl py-3 font-semibold text-white transition-opacity disabled:opacity-40"
                style={{ background: EVENT_COLORS[color] }}
              >
                {editing ? 'Guardar cambios' : 'Añadir evento'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

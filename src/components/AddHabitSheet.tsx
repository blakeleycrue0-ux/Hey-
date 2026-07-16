import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Trash2, X } from 'lucide-react'
import type { Habit, HabitColor, HabitIconKey } from '../types'
import { HABIT_COLORS, ALL_ICONS, BRAND } from '../types'
import { HabitIcon } from '../lib/icons'
import type { NewHabitInput } from '../hooks/useHabits'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

interface Props {
  open: boolean
  editing: Habit | null
  onClose: () => void
  onSave: (input: NewHabitInput) => void
  onDelete: (id: string) => void
}

export const AddHabitSheet = ({ open, editing, onClose, onSave, onDelete }: Props) => {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<HabitIconKey>(ALL_ICONS[0])
  const [color, setColor] = useState<HabitColor>('indigo')
  const [days, setDays] = useState<number[]>([])

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '')
      setIcon(editing?.icon ?? ALL_ICONS[Math.floor(Math.random() * ALL_ICONS.length)])
      setColor(editing?.color ?? 'indigo')
      setDays(editing?.days ?? [])
    }
  }, [open, editing])

  const toggleDay = (d: number) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()))
  }

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name, icon, color, days })
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
                {editing ? 'Edit habit' : 'New habit'}
              </h2>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drink water"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-base text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2"
              style={{ ['--tw-ring-color' as string]: BRAND }}
            />

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Icon</p>
            <div className="flex flex-wrap gap-2">
              {ALL_ICONS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform"
                  style={{
                    background: i === icon ? HABIT_COLORS[color] : 'rgba(128,128,128,0.08)',
                    color: i === icon ? 'white' : 'rgba(128,128,128,0.8)',
                    transform: i === icon ? 'scale(1.08)' : undefined,
                  }}
                >
                  <HabitIcon name={i} size={18} />
                </button>
              ))}
            </div>

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Color</p>
            <div className="flex gap-2">
              {(Object.keys(HABIT_COLORS) as HabitColor[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="h-8 w-8 rounded-full transition-transform"
                  style={{
                    background: HABIT_COLORS[c],
                    transform: c === color ? 'scale(1.15)' : undefined,
                    boxShadow: c === color ? `0 0 0 2px white, 0 0 0 4px ${HABIT_COLORS[c]}` : undefined,
                  }}
                />
              ))}
            </div>

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Repeat {days.length === 0 && '(every day)'}
            </p>
            <div className="flex gap-1.5">
              {WEEKDAYS.map((w, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors"
                  style={{
                    background: days.includes(i) ? HABIT_COLORS[color] : undefined,
                    color: days.includes(i) ? 'white' : undefined,
                  }}
                >
                  <span
                    className={
                      days.includes(i)
                        ? ''
                        : 'flex h-full w-full items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }
                  >
                    {w}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              {editing && (
                <button
                  onClick={() => {
                    onDelete(editing.id)
                    onClose()
                  }}
                  className="flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900 px-4 py-3 text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex-1 rounded-xl py-3 font-semibold text-white transition-opacity disabled:opacity-40"
                style={{ background: HABIT_COLORS[color] }}
              >
                {editing ? 'Save changes' : 'Add habit'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

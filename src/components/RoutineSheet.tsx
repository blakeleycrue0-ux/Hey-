import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Trash2, X } from 'lucide-react'
import type { Habit, HabitIconKey } from '../types'
import { HABIT_COLORS, ALL_ICONS, BRAND } from '../types'
import { HabitIcon } from '../lib/icons'
import type { Routine, NewRoutineInput } from '../hooks/useRoutines'

interface Props {
  open: boolean
  editing: Routine | null
  habits: Habit[]
  onClose: () => void
  onSave: (input: NewRoutineInput) => void
  onDelete: (id: string) => void
}

export const RoutineSheet = ({ open, editing, habits, onClose, onSave, onDelete }: Props) => {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<HabitIconKey>('Sparkles')
  const [habitIds, setHabitIds] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '')
      setIcon(editing?.icon ?? 'Sparkles')
      setHabitIds(editing?.habitIds ?? [])
    }
  }, [open, editing])

  const toggleHabit = (id: string) => {
    setHabitIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleSave = () => {
    if (!name.trim() || habitIds.length === 0) return
    onSave({ name: name.trim(), icon, habitIds })
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
                {editing ? 'Editar rutina' : 'Nueva rutina'}
              </h2>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Rutina de mañana"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-base text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2"
              style={{ ['--tw-ring-color' as string]: BRAND }}
            />

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Icono</p>
            <div className="flex flex-wrap gap-2">
              {ALL_ICONS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform"
                  style={{
                    background: i === icon ? BRAND : 'rgba(128,128,128,0.08)',
                    color: i === icon ? 'white' : 'rgba(128,128,128,0.8)',
                    transform: i === icon ? 'scale(1.08)' : undefined,
                  }}
                >
                  <HabitIcon name={i} size={18} />
                </button>
              ))}
            </div>

            <p className="mt-4 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
              Hábitos incluidos {habitIds.length === 0 && '(elige al menos uno)'}
            </p>
            <div className="space-y-1.5">
              {habits.length === 0 && <p className="text-sm text-zinc-400">Aún no tienes hábitos.</p>}
              {habits.map((h) => {
                const selected = habitIds.includes(h.id)
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className="flex w-full items-center gap-3 rounded-xl border-2 p-2.5 text-left"
                    style={{ borderColor: selected ? BRAND : 'rgba(128,128,128,0.15)' }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white" style={{ background: HABIT_COLORS[h.color] }}>
                      <HabitIcon name={h.icon} size={16} />
                    </div>
                    <span className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">{h.name}</span>
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                      style={{ borderColor: selected ? BRAND : 'rgba(128,128,128,0.35)', background: selected ? BRAND : 'transparent' }}
                    >
                      {selected && <Check size={12} strokeWidth={3} className="text-white" />}
                    </div>
                  </button>
                )
              })}
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
                disabled={!name.trim() || habitIds.length === 0}
                className="flex-1 rounded-xl py-3 font-semibold text-white transition-opacity disabled:opacity-40"
                style={{ background: BRAND }}
              >
                {editing ? 'Guardar cambios' : 'Crear rutina'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

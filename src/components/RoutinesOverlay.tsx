import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Plus } from 'lucide-react'
import { BRAND, type Habit } from '../types'
import { HabitIcon } from '../lib/icons'
import type { Routine } from '../hooks/useRoutines'

interface Props {
  open: boolean
  routines: Routine[]
  habits: Habit[]
  onClose: () => void
  onAdd: () => void
  onEdit: (routine: Routine) => void
}

export const RoutinesOverlay = ({ open, routines, habits, onClose, onAdd, onEdit }: Props) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        className="fixed inset-0 z-50 mx-auto max-w-md overflow-y-auto bg-cream dark:bg-zinc-950"
      >
        <div className="flex items-center gap-3 px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-3">
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 shadow-sm">
            <ChevronLeft size={18} />
          </button>
          <h1 className="flex-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">Rutinas</h1>
          <button onClick={onAdd} className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm" style={{ background: BRAND }}>
            <Plus size={18} />
          </button>
        </div>

        <div className="px-4 pb-10">
          {routines.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center text-zinc-400">
              <p className="text-sm">Aún no tienes rutinas. Agrupa varios hábitos para marcarlos todos a la vez.</p>
              <button onClick={onAdd} className="mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md" style={{ background: BRAND }}>
                Crear rutina
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {routines.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onEdit(r)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: BRAND }}>
                    <HabitIcon name={r.icon} size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{r.name}</p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {r.habitIds
                        .map((id) => habits.find((h) => h.id === id)?.name)
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

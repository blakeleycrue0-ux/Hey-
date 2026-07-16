import { AnimatePresence, motion } from 'framer-motion'
import { Archive, ChevronLeft, RotateCcw, Trash2 } from 'lucide-react'
import type { Habit } from '../types'
import { HABIT_COLORS } from '../types'
import { HabitIcon } from '../lib/icons'

interface Props {
  open: boolean
  habits: Habit[]
  onClose: () => void
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

export const ArchivedHabitsOverlay = ({ open, habits, onClose, onRestore, onDelete }: Props) => (
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
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Hábitos archivados</h1>
        </div>

        <div className="px-4 pb-10">
          {habits.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center text-zinc-400">
              <Archive size={32} className="mb-2 opacity-40" />
              <p className="text-sm">No tienes hábitos archivados.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {habits.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: HABIT_COLORS[h.color] }}>
                    <HabitIcon name={h.icon} size={18} />
                  </div>
                  <p className="min-w-0 flex-1 truncate font-medium text-zinc-900 dark:text-zinc-100">{h.name}</p>
                  <button
                    onClick={() => onRestore(h.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                    aria-label="Restaurar"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(h.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-red-500"
                    aria-label="Eliminar definitivamente"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

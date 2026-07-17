import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Lock, Trophy } from 'lucide-react'
import { BRAND, type HEvent } from '../types'
import { computeAchievements } from '../lib/achievements'

interface Props {
  open: boolean
  events: HEvent[]
  onClose: () => void
}

export const AchievementsOverlay = ({ open, events, onClose }: Props) => {
  const achievements = computeAchievements(events)
  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
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
            <div>
              <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Logros</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{unlockedCount}/{achievements.length} desbloqueados</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 pb-10">
            {achievements.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl border border-black/5 dark:border-white/[0.06] p-4 text-center"
                style={{ background: a.unlocked ? 'white' : 'rgba(128,128,128,0.06)' }}
              >
                <div
                  className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: a.unlocked ? BRAND : 'rgba(128,128,128,0.15)' }}
                >
                  {a.unlocked ? <Trophy size={22} className="text-white" /> : <Lock size={18} className="text-zinc-400" />}
                </div>
                <p className={`text-sm font-semibold ${a.unlocked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`}>{a.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{a.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

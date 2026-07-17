import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { SettingsView } from './SettingsView'
import type { HEvent } from '../types'
import type { Prefs, Theme } from '../lib/storage'
import type { AuthedUser } from '../hooks/useAuth'

interface Props {
  open: boolean
  user: AuthedUser
  events: HEvent[]
  archivedCount: number
  theme: Theme
  onSetTheme: (t: Theme) => void
  prefs: Prefs
  onUpdatePrefs: (patch: Partial<Prefs>) => void
  onClose: () => void
  onUpgrade: () => void
  onLogout: () => void
  onResetData: () => void
  onOpenArchived: () => void
  onOpenAchievements: () => void
  onImportEvents: (events: HEvent[]) => void
}

export const SettingsOverlay = ({ open, onClose, ...rest }: Props) => (
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
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Ajustes</h1>
        </div>
        <SettingsView {...rest} />
      </motion.div>
    )}
  </AnimatePresence>
)

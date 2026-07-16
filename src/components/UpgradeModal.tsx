import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Plan } from '../types'
import { PaywallScreen } from './PaywallScreen'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (plan: Plan) => void
  offer?: boolean
}

export const UpgradeModal = ({ open, onClose, onSelect, offer }: Props) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 34 }}
        className="fixed inset-0 z-50 mx-auto max-w-md overflow-y-auto bg-cream dark:bg-zinc-950"
      >
        <button
          onClick={onClose}
          className="fixed right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
          style={{ top: 'calc(1rem + env(safe-area-inset-top))' }}
        >
          <X size={18} />
        </button>
        <PaywallScreen onSelect={onSelect} offer={offer} />
      </motion.div>
    )}
  </AnimatePresence>
)

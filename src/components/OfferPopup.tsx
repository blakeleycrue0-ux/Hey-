import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { BRAND } from '../types'

interface Props {
  open: boolean
  onAccept: () => void
  onDismiss: () => void
}

export const OfferPopup = ({ open, onAccept, onDismiss }: Props) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="fixed inset-x-6 top-1/2 z-[61] mx-auto max-w-xs -translate-y-1/2 rounded-3xl bg-white dark:bg-zinc-900 p-6 text-center shadow-2xl"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white" style={{ background: BRAND }}>
            <Sparkles size={26} />
          </div>
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">Oferta especial solo para ti</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Llévate Loop Pro el primer mes por solo
          </p>
          <p className="mt-1">
            <span className="mr-2 text-base text-zinc-400 line-through">1,99 €</span>
            <span className="text-2xl font-extrabold" style={{ color: BRAND }}>0,99 €</span>
          </p>
          <button onClick={onAccept} className="mt-5 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-md" style={{ background: BRAND }}>
            Ver oferta
          </button>
          <button onClick={onDismiss} className="mt-3 w-full text-center text-xs font-medium text-zinc-400">
            Ahora no
          </button>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)

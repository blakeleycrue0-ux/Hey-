import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { BRAND } from '../types'
import { LogoMark } from './LogoMark'

interface Props {
  open: boolean
  expiresAt: number | null
  onAccept: () => void
  onDismiss: () => void
}

const REVIEWS = [
  { name: 'Marta', text: 'Llevo 45 días seguidos, nunca había sido tan constante.' },
  { name: 'Diego', text: 'El mejor tracker de hábitos que he probado.' },
  { name: 'Laura', text: 'Simple y bonito, exactamente lo que necesitaba.' },
]

const formatRemaining = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export const OfferPopup = ({ open, expiresAt, onAccept, onDismiss }: Props) => {
  const [step, setStep] = useState<'offer' | 'confirm'>('offer')
  const [remaining, setRemaining] = useState(() => (expiresAt ? expiresAt - Date.now() : 0))

  useEffect(() => {
    if (open) setStep('offer')
  }, [open])

  useEffect(() => {
    if (!open || !expiresAt) return
    const tick = () => setRemaining(expiresAt - Date.now())
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [open, expiresAt])

  const expired = expiresAt !== null && remaining <= 0

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === 'offer' ? () => setStep('confirm') : undefined}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed inset-x-6 top-1/2 z-[61] mx-auto max-h-[85vh] max-w-xs -translate-y-1/2 overflow-y-auto rounded-3xl bg-white dark:bg-zinc-900 text-center shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {step === 'offer' && !expired ? (
                <motion.div
                  key="offer"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="p-6"
                >
                  <div className="relative mx-auto mb-4 w-fit">
                    <LogoMark size={64} />
                    <span
                      className="absolute -right-2 -top-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                      style={{ background: BRAND }}
                    >
                      -50%
                    </span>
                  </div>
                  <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">Oferta especial solo para ti</h2>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Llévate Loop Pro el primer mes por solo</p>
                  <p className="mt-1">
                    <span className="mr-2 text-base text-zinc-400 line-through">1,99 €</span>
                    <span className="text-2xl font-extrabold" style={{ color: BRAND }}>0,99 €</span>
                  </p>
                  {expiresAt && !expired && (
                    <p className="mt-2 text-xs font-semibold tabular-nums" style={{ color: BRAND }}>
                      Termina en {formatRemaining(remaining)}
                    </p>
                  )}
                  <button onClick={onAccept} className="mt-5 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-md" style={{ background: BRAND }}>
                    Ver oferta
                  </button>
                  <button onClick={() => setStep('confirm')} className="mt-3 w-full text-center text-xs font-medium text-zinc-400">
                    Ahora no
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="p-6"
                >
                  <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                    {expired ? 'La oferta ha caducado' : '¿Seguro que quieres perdértela?'}
                  </h2>

                  {expiresAt && (
                    <p className="mt-2 text-2xl font-extrabold tabular-nums" style={{ color: expired ? '#9ca3af' : BRAND }}>
                      {expired ? '00:00:00' : formatRemaining(remaining)}
                    </p>
                  )}
                  {!expired && <p className="text-xs text-zinc-400">antes de que desaparezca</p>}

                  <div className="mt-4 space-y-2">
                    {REVIEWS.map((r, i) => (
                      <motion.div
                        key={r.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.12 }}
                        className="rounded-xl bg-zinc-50 dark:bg-white/[0.04] p-2.5 text-left"
                      >
                        <div className="mb-0.5 flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{r.name}</span>
                          <div className="flex gap-0.5 text-amber-400">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star key={s} size={9} fill="currentColor" strokeWidth={0} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{r.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  {!expired ? (
                    <>
                      <button onClick={onAccept} className="mt-5 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-md" style={{ background: BRAND }}>
                        Quiero mi oferta
                      </button>
                      <button onClick={onDismiss} className="mt-3 w-full text-center text-xs font-medium text-zinc-400">
                        No, gracias
                      </button>
                    </>
                  ) : (
                    <button onClick={onDismiss} className="mt-5 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-md" style={{ background: BRAND }}>
                      Entendido
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

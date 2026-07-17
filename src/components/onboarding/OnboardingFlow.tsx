import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { EVENT_CATEGORIES, EVENT_COLORS, BRAND, type EventCategory, type EventColor, type Plan } from '../../types'
import type { NewEventInput } from '../../hooks/useEvents'
import { EventIcon } from '../../lib/icons'
import { toKey, today } from '../../lib/date'
import { PaywallScreen } from '../PaywallScreen'
import { LogoMark } from '../LogoMark'

type Step = 'welcome' | 'category' | 'event' | 'paywall'

interface Props {
  userName: string
  onFinish: (event: NewEventInput, plan: Plan) => void
}

export const OnboardingFlow = ({ userName, onFinish }: Props) => {
  const [step, setStep] = useState<Step>('welcome')
  const [category, setCategory] = useState<EventCategory | null>(null)
  const [name, setName] = useState('')
  const [date, setDate] = useState(() => toKey(today()))
  const [color, setColor] = useState<EventColor>('navy')
  const [repeatYearly, setRepeatYearly] = useState(false)

  const eventInput = (): NewEventInput => ({
    name,
    targetDate: date,
    icon: category?.icon ?? 'Star',
    color,
    repeatYearly,
  })

  const canCreate = name.trim().length > 0 && date.length > 0

  return (
    <div className="min-h-screen bg-cream dark:bg-zinc-950">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <Frame key="welcome">
            <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
              <LogoMark size={64} className="mb-6" />
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Hola, {userName.split(' ')[0]}</h1>
              <p className="mt-2 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
                Vamos a crear tu primera cuenta atrás. Solo te llevará un minuto.
              </p>
              <button
                onClick={() => setStep('category')}
                className="mt-8 rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-md"
                style={{ background: BRAND }}
              >
                Empezar
              </button>
            </div>
          </Frame>
        )}

        {step === 'category' && (
          <Frame key="category">
            <Header onBack={() => setStep('welcome')} title="¿Qué quieres contar?" subtitle="Elige el tipo de evento" />
            <div className="grid grid-cols-2 gap-3 px-6 pb-8">
              {EVENT_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(c)
                    setColor(c.color)
                    setRepeatYearly(c.repeatYearly)
                    setStep('event')
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: BRAND }}>
                    <EventIcon name={c.icon} size={22} />
                  </div>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{c.label}</span>
                </button>
              ))}
            </div>
          </Frame>
        )}

        {step === 'event' && category && (
          <Frame key="event">
            <Header onBack={() => setStep('category')} title={category.label} subtitle="¿Cómo se llama y para cuándo es?" />
            <div className="space-y-4 px-6">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="p. ej. Cumpleaños de Ana"
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2"
                style={{ ['--tw-ring-color' as string]: BRAND }}
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2"
                style={{ ['--tw-ring-color' as string]: BRAND }}
              />

              <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 p-3">
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

              <p className="pt-1 text-xs font-medium uppercase tracking-wide text-zinc-400">Color</p>
              <div className="flex gap-2 pb-2">
                {(Object.keys(EVENT_COLORS) as EventColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="h-8 w-8 rounded-full transition-transform"
                    style={{
                      background: EVENT_COLORS[c],
                      transform: color === c ? 'scale(1.15)' : undefined,
                      boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${EVENT_COLORS[c]}` : undefined,
                    }}
                  />
                ))}
              </div>

              <button
                disabled={!canCreate}
                onClick={() => setStep('paywall')}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow-md disabled:opacity-40"
                style={{ background: BRAND }}
              >
                Crear mi primera cuenta atrás
              </button>
            </div>
          </Frame>
        )}

        {step === 'paywall' && (
          <Frame key="paywall">
            <PaywallScreen
              onSelect={(plan) => onFinish(eventInput(), plan)}
              onSkip={() => onFinish(eventInput(), 'free')}
            />
          </Frame>
        )}
      </AnimatePresence>
    </div>
  )
}

const Frame = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 16 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -16 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
)

const Header = ({ onBack, title, subtitle }: { onBack: () => void; title: string; subtitle: string }) => (
  <div className="px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-5">
    <button onClick={onBack} className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
      <ChevronLeft size={18} />
    </button>
    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h2>
    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
  </div>
)

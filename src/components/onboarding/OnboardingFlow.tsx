import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, Flame } from 'lucide-react'
import { CATEGORIES, HABIT_COLORS, BRAND, type HabitCategory, type HabitColor, type HabitIconKey, type Plan, type SuggestedHabit } from '../../types'
import type { NewHabitInput } from '../../hooks/useHabits'
import { HabitIcon } from '../../lib/icons'
import { PaywallScreen } from '../PaywallScreen'

type Step = 'welcome' | 'category' | 'habit' | 'paywall'

interface Props {
  userName: string
  onFinish: (habit: NewHabitInput, plan: Plan) => void
}

export const OnboardingFlow = ({ userName, onFinish }: Props) => {
  const [step, setStep] = useState<Step>('welcome')
  const [category, setCategory] = useState<HabitCategory | null>(null)
  const [choice, setChoice] = useState<SuggestedHabit | null>(null)
  const [customName, setCustomName] = useState('')
  const [usingCustom, setUsingCustom] = useState(false)
  const [color, setColor] = useState<HabitColor>('indigo')

  const habitInput = (): NewHabitInput => ({
    name: usingCustom ? customName : (choice?.name ?? ''),
    icon: (usingCustom ? 'Sparkles' : choice?.icon) as HabitIconKey,
    color,
    days: [],
  })

  const canCreate = usingCustom ? customName.trim().length > 0 : choice !== null

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <Frame key="welcome">
            <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: BRAND }}>
                <Flame size={30} className="text-white" fill="white" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Hola, {userName.split(' ')[0]} 👋</h1>
              <p className="mt-2 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
                Vamos a crear tu primer hábito. Solo te llevará un minuto.
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
            <Header onBack={() => setStep('welcome')} title="¿Qué quieres mejorar?" subtitle="Elige una categoría para empezar" />
            <div className="grid grid-cols-2 gap-3 px-6 pb-8">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(c)
                    setChoice(null)
                    setUsingCustom(false)
                    setStep('habit')
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] p-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${BRAND}1a`, color: BRAND }}>
                    <HabitIcon name={c.icon} size={22} />
                  </div>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{c.label}</span>
                </button>
              ))}
            </div>
          </Frame>
        )}

        {step === 'habit' && category && (
          <Frame key="habit">
            <Header onBack={() => setStep('category')} title={category.label} subtitle="Elige un hábito para empezar" />
            <div className="space-y-2 px-6">
              {category.habits.map((h) => (
                <button
                  key={h.name}
                  onClick={() => {
                    setChoice(h)
                    setUsingCustom(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left"
                  style={{
                    borderColor: !usingCustom && choice?.name === h.name ? BRAND : 'rgba(128,128,128,0.15)',
                    background: !usingCustom && choice?.name === h.name ? `${BRAND}0d` : undefined,
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${HABIT_COLORS[color]}1a`, color: HABIT_COLORS[color] }}>
                    <HabitIcon name={h.icon} size={18} />
                  </div>
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{h.name}</span>
                </button>
              ))}

              <button
                onClick={() => setUsingCustom(true)}
                className="w-full rounded-xl border-2 border-dashed p-3 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400"
                style={{ borderColor: usingCustom ? BRAND : 'rgba(128,128,128,0.2)' }}
              >
                Prefiero escribir el mío
              </button>
              {usingCustom && (
                <input
                  autoFocus
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Nombre de tu hábito"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2"
                  style={{ ['--tw-ring-color' as string]: BRAND }}
                />
              )}

              <p className="pt-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Color</p>
              <div className="flex gap-2 pb-2">
                {(Object.keys(HABIT_COLORS) as HabitColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="h-8 w-8 rounded-full transition-transform"
                    style={{
                      background: HABIT_COLORS[c],
                      transform: color === c ? 'scale(1.15)' : undefined,
                      boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${HABIT_COLORS[c]}` : undefined,
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
                Crear mi primer hábito
              </button>
            </div>
          </Frame>
        )}

        {step === 'paywall' && (
          <Frame key="paywall">
            <PaywallScreen
              onSelect={(plan) => onFinish(habitInput(), plan)}
              onSkip={() => onFinish(habitInput(), 'free')}
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

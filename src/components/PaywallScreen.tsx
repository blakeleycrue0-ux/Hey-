import { useState } from 'react'
import { Check, Star, BarChart3, Infinity as InfinityIcon, Palette } from 'lucide-react'
import { BRAND, type Plan } from '../types'

interface Props {
  onSelect: (plan: Plan) => void
  onSkip?: () => void
}

const REVIEWS = [
  { name: 'Marta', text: 'Llevo 45 días seguidos, nunca había sido tan constante.' },
  { name: 'Diego', text: 'El mejor tracker de hábitos que he probado, y eso que he probado muchos.' },
  { name: 'Laura', text: 'Simple y bonito, exactamente lo que necesitaba para empezar.' },
]

const PERKS = [
  { icon: InfinityIcon, text: 'Hábitos ilimitados' },
  { icon: BarChart3, text: 'Analíticas avanzadas y tendencias' },
  { icon: Palette, text: 'Colores e iconos exclusivos' },
]

export const PaywallScreen = ({ onSelect, onSkip }: Props) => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')

  return (
    <div className="flex min-h-screen flex-col px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))]">
      <div className="mx-auto w-full max-w-sm flex-1">
        <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Desbloquea Loop Pro
        </h1>
        <p className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Hábitos ilimitados y analíticas completas.
        </p>

        <div className="mt-6 space-y-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4">
          {PERKS.map((p) => (
            <div key={p.text} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${BRAND}1a`, color: BRAND }}>
                <p.icon size={16} />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{p.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          <PlanOption
            selected={billing === 'annual'}
            onClick={() => setBilling('annual')}
            title="Anual"
            price="4,17 €/mes"
            badge="Ahorra 50%"
            sub="Se cobra 49,99 €/año"
          />
          <PlanOption
            selected={billing === 'monthly'}
            onClick={() => setBilling('monthly')}
            title="Mensual"
            price="8,99 €/mes"
            sub="Se cobra cada mes"
          />
        </div>

        <button
          onClick={() => onSelect(billing)}
          className="mt-5 w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-md"
          style={{ background: BRAND }}
        >
          Empezar prueba de 7 días gratis
        </button>

        {onSkip && (
          <button onClick={onSkip} className="mt-3 w-full text-center text-sm font-medium text-zinc-400">
            Continuar con el plan gratis
          </button>
        )}

        <div className="mt-6 space-y-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-xl bg-zinc-50 dark:bg-white/[0.03] p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{r.name}</span>
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PlanOption = ({
  selected,
  onClick,
  title,
  price,
  sub,
  badge,
}: {
  selected: boolean
  onClick: () => void
  title: string
  price: string
  sub: string
  badge?: string
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center justify-between rounded-xl border-2 p-3.5 text-left transition-colors"
    style={{
      borderColor: selected ? BRAND : 'rgba(128,128,128,0.2)',
      background: selected ? `${BRAND}0d` : undefined,
    }}
  >
    <div className="flex items-center gap-3">
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
        style={{ borderColor: selected ? BRAND : 'rgba(128,128,128,0.35)', background: selected ? BRAND : 'transparent' }}
      >
        {selected && <Check size={12} strokeWidth={3} className="text-white" />}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
          {badge && (
            <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ background: BRAND }}>
              {badge}
            </span>
          )}
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{sub}</span>
      </div>
    </div>
    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{price}</span>
  </button>
)

import { useState } from 'react'
import { Check, Star, BarChart3, Sparkles, Infinity as InfinityIcon, Palette } from 'lucide-react'
import { BRAND, type Plan } from '../types'
import { LogoMark } from './LogoMark'

interface Props {
  onSelect: (plan: Plan) => void
  onSkip?: () => void
  /** Intro offer: first month at a lower price on the monthly plan. */
  offer?: boolean
}

const REVIEWS = [
  { name: 'Marta', text: 'Llevo 45 días seguidos, nunca había sido tan constante.' },
  { name: 'Diego', text: 'El mejor tracker de hábitos que he probado, y eso que he probado muchos.' },
  { name: 'Laura', text: 'Simple y bonito, exactamente lo que necesitaba para empezar.' },
]

const PERKS = [
  { icon: InfinityIcon, title: 'Hábitos ilimitados', text: 'Sin límite en cuántos hábitos puedes seguir' },
  { icon: BarChart3, title: 'Insights avanzados', text: 'Ve exactamente qué días te funcionan mejor' },
  { icon: Palette, title: 'Colores e iconos extra', text: 'Personaliza cada hábito a tu manera' },
]

export const PaywallScreen = ({ onSelect, onSkip, offer }: Props) => {
  const [billing, setBilling] = useState<'monthly' | 'annual'>(offer ? 'monthly' : 'annual')

  return (
    <div className="flex min-h-screen flex-col px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(2rem+env(safe-area-inset-top))]">
      <div className="mx-auto w-full max-w-sm flex-1">
        {offer && (
          <div className="mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ background: BRAND }}>
            <Sparkles size={13} />
            Oferta especial solo para ti
          </div>
        )}

        <LogoMark size={64} className="mx-auto mb-5" />
        <h1 className="text-center text-[26px] font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100">
          Construye hábitos que de verdad se quedan
        </h1>

        <div className="mt-7 space-y-4">
          {PERKS.map((p) => (
            <div key={p.title} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: BRAND }}>
                <p.icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 space-y-2.5">
          <PlanOption
            selected={billing === 'annual'}
            onClick={() => setBilling('annual')}
            title="Anual"
            price="1,08 €/mes"
            badge="Ahorra 46%"
            sub="Se cobra 12,99 €/año"
          />
          <PlanOption
            selected={billing === 'monthly'}
            onClick={() => setBilling('monthly')}
            title="Mensual"
            price={offer ? '0,99 €/mes' : '1,99 €/mes'}
            originalPrice={offer ? '1,99 €/mes' : undefined}
            badge={offer ? 'Oferta' : undefined}
            sub={offer ? 'El primer mes, luego 1,99 €/mes' : 'Se cobra cada mes'}
          />
        </div>

        <button
          onClick={() => onSelect(billing)}
          className="mt-5 w-full rounded-2xl py-3.5 text-[15px] font-semibold text-white shadow-lg"
          style={{ background: BRAND }}
        >
          {offer ? 'Aprovechar oferta' : 'Empezar prueba de 7 días gratis'}
        </button>

        {onSkip && (
          <button onClick={onSkip} className="mt-3 w-full text-center text-sm font-medium text-zinc-400">
            Continuar con el plan gratis
          </button>
        )}

        <div className="mt-7 space-y-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-2xl bg-white dark:bg-white/[0.04] p-3.5 shadow-sm">
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
  originalPrice,
  sub,
  badge,
}: {
  selected: boolean
  onClick: () => void
  title: string
  price: string
  originalPrice?: string
  sub: string
  badge?: string
}) => (
  <button
    onClick={onClick}
    className="relative flex w-full items-center justify-between rounded-2xl border-2 bg-white dark:bg-white/[0.04] p-4 text-left transition-colors"
    style={{ borderColor: selected ? BRAND : 'rgba(128,128,128,0.18)' }}
  >
    {badge && (
      <span
        className="absolute -top-2.5 right-4 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
        style={{ background: BRAND }}
      >
        {badge}
      </span>
    )}
    <div className="flex items-center gap-3">
      <div
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
        style={{ borderColor: selected ? BRAND : 'rgba(128,128,128,0.35)', background: selected ? BRAND : 'transparent' }}
      >
        {selected && <Check size={12} strokeWidth={3} className="text-white" />}
      </div>
      <div>
        <span className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>
      </div>
    </div>
    <div className="text-right">
      {originalPrice && <p className="text-xs text-zinc-400 line-through">{originalPrice}</p>}
      <span className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">{price}</span>
    </div>
  </button>
)

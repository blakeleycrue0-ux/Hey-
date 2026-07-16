import { Crown, Settings } from 'lucide-react'
import { BRAND, type Plan } from '../types'

interface Props {
  title: string
  plan: Plan
  onOpenSettings: () => void
  onOpenUpgrade: () => void
}

export const Header = ({ title, plan, onOpenSettings, onOpenUpgrade }: Props) => (
  <div className="flex items-center justify-between px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-3">
    <button
      onClick={onOpenSettings}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 shadow-sm"
      aria-label="Ajustes"
    >
      <Settings size={18} />
    </button>
    <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{title}</h1>
    <button
      onClick={onOpenUpgrade}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-white/[0.06] shadow-sm"
      style={{ color: plan === 'free' ? undefined : BRAND }}
      aria-label="Loop Pro"
    >
      <Crown size={18} className={plan === 'free' ? 'text-zinc-600 dark:text-zinc-300' : ''} fill={plan === 'free' ? 'none' : BRAND} />
    </button>
  </div>
)

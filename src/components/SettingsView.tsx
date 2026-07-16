import { Crown, LogOut, Moon, RotateCcw, Sun, SunMoon, Trash2 } from 'lucide-react'
import { BRAND, FREE_HABIT_LIMIT, type Plan } from '../types'
import type { Theme } from '../lib/storage'
import type { AuthedUser } from '../hooks/useAuth'

interface Props {
  user: AuthedUser
  habitCount: number
  theme: Theme
  onSetTheme: (t: Theme) => void
  onUpgrade: () => void
  onLogout: () => void
  onResetData: () => void
}

const PLAN_LABEL: Record<Plan, string> = {
  free: 'Plan gratis',
  monthly: 'Loop Pro · Mensual',
  annual: 'Loop Pro · Anual',
}

export const SettingsView = ({ user, habitCount, theme, onSetTheme, onUpgrade, onLogout, onResetData }: Props) => (
  <div className="px-4 pt-2 pb-28">
    <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
      ) : (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white"
          style={{ background: BRAND }}
        >
          {user.name.trim().slice(0, 1).toUpperCase() || '?'}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
      </div>
    </div>

    <div
      className="mt-3 flex items-center gap-3 rounded-2xl p-4"
      style={{ background: user.plan === 'free' ? undefined : `${BRAND}14` }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: BRAND }}>
        <Crown size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{PLAN_LABEL[user.plan]}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {user.plan === 'free' ? `${habitCount}/${FREE_HABIT_LIMIT} hábitos usados` : 'Hábitos e insights ilimitados'}
        </p>
      </div>
      {user.plan === 'free' && (
        <button onClick={onUpgrade} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow" style={{ background: BRAND }}>
          Mejorar
        </button>
      )}
    </div>

    <p className="mt-6 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Apariencia</p>
    <div className="flex gap-2 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-1.5">
      <ThemeOption current={theme} value="light" icon={<Sun size={16} />} label="Claro" onSet={onSetTheme} />
      <ThemeOption current={theme} value="dark" icon={<Moon size={16} />} label="Oscuro" onSet={onSetTheme} />
      <ThemeOption current={theme} value="system" icon={<SunMoon size={16} />} label="Auto" onSet={onSetTheme} />
    </div>

    <p className="mt-6 mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">Cuenta</p>
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06]">
      <button onClick={onResetData} className="flex w-full items-center gap-3 border-b border-black/5 dark:border-white/[0.06] px-4 py-3.5 text-left">
        <RotateCcw size={17} className="text-zinc-400" />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">Reiniciar datos</span>
      </button>
      <button onClick={onLogout} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <LogOut size={17} className="text-red-500" />
        <span className="text-sm text-red-500">Cerrar sesión</span>
      </button>
    </div>

    <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-400">
      <Trash2 size={12} />
      Tus hábitos se guardan en este dispositivo
    </p>
  </div>
)

const ThemeOption = ({
  current,
  value,
  icon,
  label,
  onSet,
}: {
  current: Theme
  value: Theme
  icon: React.ReactNode
  label: string
  onSet: (t: Theme) => void
}) => (
  <button
    onClick={() => onSet(value)}
    className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium"
    style={{
      background: current === value ? BRAND : undefined,
      color: current === value ? 'white' : undefined,
    }}
  >
    <span className={current === value ? '' : 'text-zinc-500 dark:text-zinc-400'}>{icon}</span>
    <span className={current === value ? '' : 'text-zinc-500 dark:text-zinc-400'}>{label}</span>
  </button>
)

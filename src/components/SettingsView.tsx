import { ChevronRight, Crown, LogOut, Moon, RotateCcw, Share2, Sun, SunMoon } from 'lucide-react'
import { FREE_HABIT_LIMIT, type Plan } from '../types'
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

const THEME_LABEL: Record<Theme, string> = { light: 'Claro', dark: 'Oscuro', system: 'Auto' }
const THEME_ICON: Record<Theme, React.ReactNode> = {
  light: <Sun size={19} />,
  dark: <Moon size={19} />,
  system: <SunMoon size={19} />,
}
const THEME_CYCLE: Record<Theme, Theme> = { light: 'dark', dark: 'system', system: 'light' }

const handleShare = () => {
  const shareData = { title: 'Loop', text: 'Estoy construyendo hábitos con Loop.', url: window.location.origin }
  if (navigator.share) {
    navigator.share(shareData).catch(() => {})
  } else {
    navigator.clipboard?.writeText(shareData.url)
  }
}

export const SettingsView = ({ user, habitCount, theme, onSetTheme, onUpgrade, onLogout, onResetData }: Props) => (
  <div className="px-4 pt-2 pb-28">
    <Group>
      <Row
        icon={
          user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 dark:bg-white text-[11px] font-semibold text-white dark:text-zinc-900">
              {user.name.trim().slice(0, 1).toUpperCase() || '?'}
            </div>
          )
        }
        title={user.name}
        subtitle={user.email}
      />
    </Group>

    <Group>
      <Row
        icon={THEME_ICON[theme]}
        title="Tema"
        subtitle={THEME_LABEL[theme]}
        onClick={() => onSetTheme(THEME_CYCLE[theme])}
        chevron
      />
    </Group>

    <Group>
      <Row
        icon={<Crown size={19} />}
        title={PLAN_LABEL[user.plan]}
        subtitle={user.plan === 'free' ? `${habitCount}/${FREE_HABIT_LIMIT} hábitos usados` : 'Hábitos e insights ilimitados'}
        onClick={onUpgrade}
        chevron
      />
    </Group>

    <Group>
      <Row icon={<Share2 size={19} />} title="Compartir Loop" subtitle="Invita a un amigo" onClick={handleShare} chevron />
      <Row icon={<RotateCcw size={19} />} title="Reiniciar datos" subtitle="Borra todos tus hábitos" onClick={onResetData} chevron />
      <Row icon={<LogOut size={19} />} title="Cerrar sesión" onClick={onLogout} danger />
    </Group>

    <p className="mt-6 text-center text-xs text-zinc-400">
      Tus hábitos se guardan en este dispositivo
    </p>
  </div>
)

const Group = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-3 overflow-hidden rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] first:mt-0 divide-y divide-black/5 dark:divide-white/[0.06]">
    {children}
  </div>
)

const Row = ({
  icon,
  title,
  subtitle,
  onClick,
  chevron,
  danger,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  onClick?: () => void
  chevron?: boolean
  danger?: boolean
}) => {
  const content = (
    <>
      <span className={danger ? 'text-red-500' : 'text-zinc-800 dark:text-zinc-200'}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[15px] font-medium ${danger ? 'text-red-500' : 'text-zinc-900 dark:text-zinc-100'}`}>{title}</p>
        {subtitle && <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
      {chevron && <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-600" />}
    </>
  )

  if (!onClick) {
    return <div className="flex items-center gap-3 px-4 py-3.5">{content}</div>
  }

  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left" style={{ WebkitTapHighlightColor: 'transparent' }}>
      {content}
    </button>
  )
}

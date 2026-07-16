import { useRef } from 'react'
import {
  Archive,
  ChevronRight,
  Crown,
  Download,
  ListChecks,
  LogOut,
  Moon,
  RotateCcw,
  Share2,
  Sun,
  SunMoon,
  Trophy,
  Upload,
} from 'lucide-react'
import { BRAND, FREE_HABIT_LIMIT, type Habit, type Plan } from '../types'
import type { Prefs, Theme } from '../lib/storage'
import type { AuthedUser } from '../hooks/useAuth'
import { exportBackup, importBackup } from '../lib/backup'

interface Props {
  user: AuthedUser
  habits: Habit[]
  archivedCount: number
  theme: Theme
  onSetTheme: (t: Theme) => void
  prefs: Prefs
  onUpdatePrefs: (patch: Partial<Prefs>) => void
  onUpgrade: () => void
  onLogout: () => void
  onResetData: () => void
  onOpenArchived: () => void
  onOpenAchievements: () => void
  onOpenRoutines: () => void
  onImportHabits: (habits: Habit[]) => void
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

const APP_VERSION = '1.0.0'

export const SettingsView = ({
  user,
  habits,
  archivedCount,
  theme,
  onSetTheme,
  prefs,
  onUpdatePrefs,
  onUpgrade,
  onLogout,
  onResetData,
  onOpenArchived,
  onOpenAchievements,
  onOpenRoutines,
  onImportHabits,
}: Props) => {
  const activeCount = habits.filter((h) => !h.archived).length
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="px-4 pt-2 pb-28">
      <button
        onClick={onUpgrade}
        className="mb-3 flex w-full items-center gap-3 rounded-2xl p-4 text-left text-white"
        style={{ background: BRAND }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold">{PLAN_LABEL[user.plan]}</p>
          <p className="text-xs text-white/60">
            {user.plan === 'free' ? `${activeCount}/${FREE_HABIT_LIMIT} hábitos usados · Mejora a Pro` : 'Hábitos e insights ilimitados'}
          </p>
        </div>
        <Crown size={26} className="text-white/80" />
      </button>

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
        {theme === 'system' && (
          <Row
            icon={<Moon size={19} />}
            title="Oscuro automático por horario"
            subtitle="20:00–7:00, en vez de seguir el sistema"
            toggle={prefs.darkByTime}
            onToggle={() => onUpdatePrefs({ darkByTime: !prefs.darkByTime })}
          />
        )}
        <Row
          icon={<CalendarIcon />}
          title="La semana empieza en"
          subtitle={prefs.weekStartsOn === 'monday' ? 'Lunes' : 'Domingo'}
          onClick={() => onUpdatePrefs({ weekStartsOn: prefs.weekStartsOn === 'monday' ? 'sunday' : 'monday' })}
          chevron
        />
        <Row
          icon={<SortIcon />}
          title="Completados al final"
          subtitle="Mueve los hábitos hechos abajo de la lista"
          toggle={prefs.autoSortDone}
          onToggle={() => onUpdatePrefs({ autoSortDone: !prefs.autoSortDone })}
        />
      </Group>

      <Group>
        <Row icon={<Download size={19} />} title="Exportar copia de seguridad" subtitle="Descarga tus hábitos en un archivo" onClick={() => exportBackup(habits)} chevron />
        <Row
          icon={<Upload size={19} />}
          title="Importar copia de seguridad"
          subtitle="Restaura desde un archivo"
          onClick={() => fileInputRef.current?.click()}
          chevron
        />
        <Row icon={<Archive size={19} />} title="Hábitos archivados" subtitle={`${archivedCount} archivados`} onClick={onOpenArchived} chevron />
        <Row icon={<Trophy size={19} />} title="Logros" subtitle="Insignias por tus hitos" onClick={onOpenAchievements} chevron />
        <Row icon={<ListChecks size={19} />} title="Rutinas" subtitle="Agrupa hábitos para marcarlos juntos" onClick={onOpenRoutines} chevron />
      </Group>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) importBackup(file).then(onImportHabits).catch(() => alert('No se pudo leer el archivo.'))
          e.target.value = ''
        }}
      />

      <Group>
        <Row icon={<Share2 size={19} />} title="Compartir Loop" subtitle="Invita a un amigo" onClick={handleShare} chevron />
        <Row icon={<RotateCcw size={19} />} title="Reiniciar datos" subtitle="Borra todos tus hábitos" onClick={onResetData} chevron />
        <Row icon={<LogOut size={19} />} title="Cerrar sesión" onClick={onLogout} danger />
      </Group>

      <p className="mt-6 text-center text-xs text-zinc-400">Tus hábitos se guardan en este dispositivo</p>
      <p className="mt-1 text-center text-xs text-zinc-300 dark:text-zinc-600">Versión {APP_VERSION}</p>
    </div>
  )
}

const CalendarIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const SortIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4" />
  </svg>
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
  toggle,
  onToggle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  onClick?: () => void
  chevron?: boolean
  danger?: boolean
  toggle?: boolean
  onToggle?: () => void
}) => {
  const content = (
    <>
      <span className={danger ? 'text-red-500' : 'text-zinc-800 dark:text-zinc-200'}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[15px] font-medium ${danger ? 'text-red-500' : 'text-zinc-900 dark:text-zinc-100'}`}>{title}</p>
        {subtitle && <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
      {chevron && <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-600" />}
      {onToggle && <Switch on={!!toggle} onClick={onToggle} />}
    </>
  )

  if (onToggle) {
    return <div className="flex items-center gap-3 px-4 py-3.5">{content}</div>
  }

  if (!onClick) {
    return <div className="flex items-center gap-3 px-4 py-3.5">{content}</div>
  }

  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left" style={{ WebkitTapHighlightColor: 'transparent' }}>
      {content}
    </button>
  )
}

const Switch = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="relative h-6 w-10 shrink-0 rounded-full transition-colors"
    style={{ background: on ? BRAND : 'rgba(128,128,128,0.3)' }}
    aria-pressed={on}
  >
    <span
      className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
      style={{ transform: on ? 'translateX(18px)' : 'translateX(2px)' }}
    />
  </button>
)

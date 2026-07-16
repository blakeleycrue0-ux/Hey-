import { BarChart3, ListChecks, Plus, Settings } from 'lucide-react'
import { BRAND } from '../types'

export type Tab = 'today' | 'stats' | 'settings'

interface Props {
  tab: Tab
  onChange: (tab: Tab) => void
  onAdd: () => void
}

export const TabBar = ({ tab, onChange, onAdd }: Props) => (
  <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md pb-[env(safe-area-inset-bottom)]">
    <div className="mx-4 mb-4 flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/[0.08] bg-white/90 dark:bg-zinc-900/90 px-5 py-3 shadow-lg backdrop-blur-md">
      <button
        onClick={() => onChange('today')}
        className="flex flex-col items-center gap-0.5 text-xs font-medium"
        style={{ color: tab === 'today' ? BRAND : undefined }}
      >
        <ListChecks size={20} className={tab === 'today' ? '' : 'text-zinc-400'} />
        <span className={tab === 'today' ? '' : 'text-zinc-400'}>Today</span>
      </button>

      <button
        onClick={onAdd}
        className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ background: BRAND }}
        aria-label="Add habit"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => onChange('stats')}
        className="flex flex-col items-center gap-0.5 text-xs font-medium"
        style={{ color: tab === 'stats' ? BRAND : undefined }}
      >
        <BarChart3 size={20} className={tab === 'stats' ? '' : 'text-zinc-400'} />
        <span className={tab === 'stats' ? '' : 'text-zinc-400'}>Stats</span>
      </button>

      <button
        onClick={() => onChange('settings')}
        className="flex flex-col items-center gap-0.5 text-xs font-medium"
        style={{ color: tab === 'settings' ? BRAND : undefined }}
      >
        <Settings size={20} className={tab === 'settings' ? '' : 'text-zinc-400'} />
        <span className={tab === 'settings' ? '' : 'text-zinc-400'}>Ajustes</span>
      </button>
    </div>
  </div>
)

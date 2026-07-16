import { BarChart3, ListChecks, Plus } from 'lucide-react'

export type Tab = 'today' | 'stats'

interface Props {
  tab: Tab
  onChange: (tab: Tab) => void
  onAdd: () => void
}

export const TabBar = ({ tab, onChange, onAdd }: Props) => (
  <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md pb-[env(safe-area-inset-bottom)]">
    <div className="mx-4 mb-4 flex items-center justify-between rounded-2xl border border-black/5 dark:border-white/[0.08] bg-white/90 dark:bg-zinc-900/90 px-6 py-3 shadow-lg backdrop-blur-md">
      <button
        onClick={() => onChange('today')}
        className={`flex flex-col items-center gap-0.5 text-xs font-medium ${tab === 'today' ? 'text-violet-500' : 'text-zinc-400'}`}
      >
        <ListChecks size={20} />
        Today
      </button>

      <button
        onClick={onAdd}
        className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #ff8a5c, #a445ff)' }}
        aria-label="Add habit"
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => onChange('stats')}
        className={`flex flex-col items-center gap-0.5 text-xs font-medium ${tab === 'stats' ? 'text-violet-500' : 'text-zinc-400'}`}
      >
        <BarChart3 size={20} />
        Stats
      </button>
    </div>
  </div>
)

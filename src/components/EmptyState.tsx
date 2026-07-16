import { Sparkles } from 'lucide-react'

export const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center px-8 pt-20 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-violet-500">
      <Sparkles size={28} className="text-white" />
    </div>
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">No habits yet</h2>
    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
      Add your first habit and start your streak today.
    </p>
    <button
      onClick={onAdd}
      className="mt-5 rounded-xl bg-gradient-to-br from-orange-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md"
    >
      Add a habit
    </button>
  </div>
)

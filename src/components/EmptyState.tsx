import { Hourglass } from 'lucide-react'
import { BRAND } from '../types'

export const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <div className="flex flex-col items-center px-8 pt-20 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: BRAND }}>
      <Hourglass size={28} className="text-white" />
    </div>
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Aún no tienes cuentas atrás</h2>
    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
      Añade una fecha importante y ve cuánto falta, día a día.
    </p>
    <button
      onClick={onAdd}
      className="mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md"
      style={{ background: BRAND }}
    >
      Añadir evento
    </button>
  </div>
)

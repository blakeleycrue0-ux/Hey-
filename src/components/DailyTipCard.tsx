import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { getDailyTip } from '../lib/dailyTip'

export const DailyTipCard = () => {
  const [tip, setTip] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getDailyTip().then((t) => {
      if (!cancelled) setTip(t)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!tip) return null

  return (
    <div className="mx-5 mb-3 flex items-start gap-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-black/5 dark:border-white/[0.06] p-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
        <Lightbulb size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Consejo del día</p>
        <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{tip}</p>
      </div>
    </div>
  )
}

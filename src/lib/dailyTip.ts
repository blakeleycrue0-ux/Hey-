const TIP_KEY = 'loop.dailyTip.v1'

const FALLBACK_TIPS = [
  'Cada día que pasa es un día menos para lo que estás esperando.',
  'La espera se hace más ligera cuando sabes exactamente cuánto queda.',
  'Anotar una fecha importante es la mejor forma de no dejarla pasar de largo.',
  'La ilusión por lo que viene también se cuida día a día.',
  'Lo que se cuenta, se recuerda. Lo que se recuerda, se disfruta más.',
]

interface CachedTip {
  date: string
  tip: string
}

const loadCached = (): CachedTip | null => {
  try {
    const raw = localStorage.getItem(TIP_KEY)
    return raw ? (JSON.parse(raw) as CachedTip) : null
  } catch {
    return null
  }
}

const saveCached = (tip: string) => {
  const data: CachedTip = { date: new Date().toISOString().slice(0, 10), tip }
  localStorage.setItem(TIP_KEY, JSON.stringify(data))
}

const fallbackTip = (): string => {
  const dayIndex = Math.floor(Date.now() / 86400000)
  return FALLBACK_TIPS[dayIndex % FALLBACK_TIPS.length]
}

export const getDailyTip = async (): Promise<string> => {
  const todayKey = new Date().toISOString().slice(0, 10)
  const cached = loadCached()
  if (cached && cached.date === todayKey) return cached.tip

  try {
    const res = await fetch('/api/daily-tip')
    if (!res.ok) throw new Error('bad response')
    const data = (await res.json()) as { tip?: string }
    if (!data.tip) throw new Error('empty tip')
    saveCached(data.tip)
    return data.tip
  } catch {
    return fallbackTip()
  }
}

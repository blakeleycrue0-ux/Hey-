const TIP_KEY = 'loop.dailyTip.v1'

const FALLBACK_TIPS = [
  'Un hábito pequeño hecho todos los días vale más que uno grande hecho una vez.',
  'No rompas la cadena dos días seguidos: fallar un día es humano, fallar dos ya es un hábito nuevo.',
  'La motivación te hace empezar, la constancia te hace llegar.',
  'Hazlo tan fácil que no puedas decir que no tienes tiempo.',
  'El mejor momento para retomar un hábito es hoy, no el lunes que viene.',
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

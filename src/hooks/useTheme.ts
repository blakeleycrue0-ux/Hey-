import { useCallback, useEffect, useState } from 'react'
import { loadTheme, saveTheme, type Theme } from '../lib/storage'

const isNightHour = (): boolean => {
  const hour = new Date().getHours()
  return hour >= 20 || hour < 7
}

export const useTheme = (darkByTime: boolean) => {
  const [theme, setThemeState] = useState<Theme>(() => loadTheme())

  useEffect(() => {
    const root = document.documentElement
    const apply = (dark: boolean) => root.classList.toggle('dark', dark)

    if (theme === 'system') {
      if (darkByTime) {
        apply(isNightHour())
        const interval = setInterval(() => apply(isNightHour()), 5 * 60 * 1000)
        return () => clearInterval(interval)
      }
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches)
      const listener = (e: MediaQueryListEvent) => apply(e.matches)
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    }
    apply(theme === 'dark')
  }, [theme, darkByTime])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    saveTheme(t)
  }, [])

  return { theme, setTheme }
}

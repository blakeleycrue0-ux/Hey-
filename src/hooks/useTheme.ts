import { useCallback, useEffect, useState } from 'react'
import { loadTheme, saveTheme, type Theme } from '../lib/storage'

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => loadTheme())

  useEffect(() => {
    const root = document.documentElement
    const apply = (dark: boolean) => root.classList.toggle('dark', dark)

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      apply(mq.matches)
      const listener = (e: MediaQueryListEvent) => apply(e.matches)
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    }
    apply(theme === 'dark')
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    saveTheme(t)
  }, [])

  return { theme, setTheme }
}

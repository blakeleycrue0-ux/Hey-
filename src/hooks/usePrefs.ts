import { useCallback, useState } from 'react'
import { loadPrefs, savePrefs, type Prefs } from '../lib/storage'

export const usePrefs = () => {
  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs())

  const updatePrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch }
      savePrefs(next)
      return next
    })
  }, [])

  return { prefs, updatePrefs }
}

import type { Habit } from '../types'

interface BackupFile {
  version: 1
  exportedAt: string
  habits: Habit[]
}

export const exportBackup = (habits: Habit[]): void => {
  const data: BackupFile = { version: 1, exportedAt: new Date().toISOString(), habits }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `loop-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importBackup = (file: File): Promise<Habit[]> =>
  file.text().then((text) => {
    const data = JSON.parse(text) as Partial<BackupFile>
    if (!Array.isArray(data.habits)) throw new Error('Archivo de copia de seguridad no válido')
    return data.habits
  })

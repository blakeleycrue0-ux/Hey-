import type { HEvent } from '../types'

interface BackupFile {
  version: 1
  exportedAt: string
  events: HEvent[]
}

export const exportBackup = (events: HEvent[]): void => {
  const data: BackupFile = { version: 1, exportedAt: new Date().toISOString(), events }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `loop-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importBackup = (file: File): Promise<HEvent[]> =>
  file.text().then((text) => {
    const data = JSON.parse(text) as Partial<BackupFile>
    if (!Array.isArray(data.events)) throw new Error('Archivo de copia de seguridad no válido')
    return data.events
  })

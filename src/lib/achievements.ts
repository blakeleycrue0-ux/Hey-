import type { HEvent } from '../types'
import { totalDaysSpan } from './countdown'

export interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
}

export const computeAchievements = (events: HEvent[]): Achievement[] => {
  const active = events.filter((e) => !e.archived)
  const archivedCount = events.filter((e) => e.archived).length
  const hasYearly = events.some((e) => e.repeatYearly)
  const hasLongHaul = events.some((e) => totalDaysSpan(e) >= 180)
  const iconSet = new Set(events.map((e) => e.icon))

  return [
    { id: 'first-event', title: 'Primer paso', description: 'Crea tu primera cuenta atrás', unlocked: events.length >= 1 },
    { id: 'collector', title: 'Organizado', description: '3 eventos activos a la vez', unlocked: active.length >= 3 },
    { id: 'planner', title: 'Planificador', description: '5 eventos activos a la vez', unlocked: active.length >= 5 },
    { id: 'yearly', title: 'No se me olvida', description: 'Sigue un cumpleaños o aniversario que se repite', unlocked: hasYearly },
    { id: 'traveler', title: 'De viaje', description: 'Añade una cuenta atrás para un viaje', unlocked: iconSet.has('Plane') },
    { id: 'graduate', title: 'A por todas', description: 'Añade una cuenta atrás para un examen o entrega', unlocked: iconSet.has('GraduationCap') || iconSet.has('FileText') },
    { id: 'longhaul', title: 'Larga espera', description: 'Sigue un evento a más de 180 días vista', unlocked: hasLongHaul },
    { id: 'archiver', title: 'Ya está', description: 'Archiva un evento que ya haya pasado', unlocked: archivedCount >= 1 },
  ]
}

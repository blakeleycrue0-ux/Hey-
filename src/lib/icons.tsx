import {
  Cake, Plane, GraduationCap, Heart, Gift, PartyPopper, Briefcase,
  Home, Baby, Gem, Trophy, Sun, Snowflake, Calendar, Star,
  Flag, Car, FileText, Clock, MapPin, Stethoscope, Music, Users, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { EventIconKey } from '../types'

export const ICONS: Record<EventIconKey, LucideIcon> = {
  Cake, Plane, GraduationCap, Heart, Gift, PartyPopper, Briefcase,
  Home, Baby, Gem, Trophy, Sun, Snowflake, Calendar, Star,
  Flag, Car, FileText, Clock, MapPin, Stethoscope, Music, Users, Sparkles,
}

export const EventIcon = ({ name, size = 20, className }: { name: EventIconKey; size?: number; className?: string }) => {
  const Icon = ICONS[name] ?? Sparkles
  return <Icon size={size} className={className} />
}

import {
  Droplet, Moon, BookOpen, Dumbbell, PenLine, Heart, Pill, Sun,
  Footprints, Brain, GraduationCap, Wallet, Ban, Coffee, Smartphone,
  Wine, Cigarette, Candy, Salad, Bed, Timer, Target, Smile,
  Sparkles, Music, Palette, Users, Home, Leaf, Bike, PiggyBank,
  TrendingUp, Calendar, Flame,
  type LucideIcon,
} from 'lucide-react'
import type { HabitIconKey } from '../types'

export const ICONS: Record<HabitIconKey, LucideIcon> = {
  Droplet, Moon, BookOpen, Dumbbell, PenLine, Heart, Pill, Sun,
  Footprints, Brain, GraduationCap, Wallet, Ban, Coffee, Smartphone,
  Wine, Cigarette, Candy, Salad, Bed, Timer, Target, Smile,
  Sparkles, Music, Palette, Users, Home, Leaf, Bike, PiggyBank,
  TrendingUp, Calendar, Flame,
}

export const HabitIcon = ({ name, size = 20, className }: { name: HabitIconKey; size?: number; className?: string }) => {
  const Icon = ICONS[name] ?? Sparkles
  return <Icon size={size} className={className} />
}

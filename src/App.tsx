import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { useTheme } from './hooks/useTheme'
import { Header } from './components/Header'
import { HabitCard } from './components/HabitCard'
import { EmptyState } from './components/EmptyState'
import { TabBar, type Tab } from './components/TabBar'
import { AddHabitSheet } from './components/AddHabitSheet'
import { HabitDetail } from './components/HabitDetail'
import { StatsView } from './components/StatsView'
import { Celebration, type Burst } from './components/Celebration'
import { HABIT_COLORS, type Habit } from './types'
import { isScheduled } from './lib/streaks'
import { today, toKey } from './lib/date'
import type { Theme } from './lib/storage'

const THEME_CYCLE: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }

function App() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleToday } = useHabits()
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState<Tab>('today')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Habit | null>(null)
  const [detailHabit, setDetailHabit] = useState<Habit | null>(null)
  const [burst, setBurst] = useState<Burst | null>(null)

  const activeHabits = habits.filter((h) => !h.archived)
  const scheduledToday = activeHabits.filter((h) => isScheduled(h, today()))
  const restToday = activeHabits.filter((h) => !isScheduled(h, today()))

  const handleToggle = (id: string, e: React.MouseEvent) => {
    const habit = habits.find((h) => h.id === id)
    if (!habit) return
    const willBeDone = !habit.completions.includes(toKey(today()))
    if (willBeDone) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setBurst({
        id: `${id}-${Date.now()}`,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        color: HABIT_COLORS[habit.color].solid,
      })
      setTimeout(() => setBurst(null), 650)
    }
    toggleToday(id)
  }

  const openAdd = () => {
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditing(habit)
    setDetailHabit(null)
    setSheetOpen(true)
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-gradient-to-b from-orange-50/40 via-white to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
      <Header
        habits={activeHabits}
        theme={theme}
        onCycleTheme={() => setTheme(THEME_CYCLE[theme])}
        title={tab === 'today' ? 'Loop' : 'Stats'}
      />

      {tab === 'today' ? (
        activeHabits.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          <div className="space-y-2 px-4 pb-28">
            {scheduledToday.map((h) => (
              <HabitCard key={h.id} habit={h} onToggle={handleToggle} onOpen={setDetailHabit} />
            ))}
            {restToday.length > 0 && (
              <>
                <p className="pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Not scheduled today
                </p>
                {restToday.map((h) => (
                  <HabitCard key={h.id} habit={h} onToggle={handleToggle} onOpen={setDetailHabit} />
                ))}
              </>
            )}
          </div>
        )
      ) : (
        <StatsView habits={activeHabits} onOpen={setDetailHabit} />
      )}

      <TabBar tab={tab} onChange={setTab} onAdd={openAdd} />

      <AddHabitSheet
        open={sheetOpen}
        editing={editing}
        onClose={() => setSheetOpen(false)}
        onSave={(input) => {
          if (editing) updateHabit(editing.id, input)
          else addHabit(input)
        }}
        onDelete={deleteHabit}
      />

      <HabitDetail habit={detailHabit} onClose={() => setDetailHabit(null)} onEdit={openEdit} />

      <Celebration burst={burst} />
    </div>
  )
}

export default App

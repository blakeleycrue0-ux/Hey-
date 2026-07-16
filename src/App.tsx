import { useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/Header'
import { WeekStrip } from './components/WeekStrip'
import { HabitCard } from './components/HabitCard'
import { EmptyState } from './components/EmptyState'
import { TabBar, type Tab } from './components/TabBar'
import { AddHabitSheet } from './components/AddHabitSheet'
import { HabitDetail } from './components/HabitDetail'
import { StatsView } from './components/StatsView'
import { SettingsOverlay } from './components/SettingsOverlay'
import { UpgradeModal } from './components/UpgradeModal'
import { LoginScreen } from './components/LoginScreen'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'
import { Celebration, type Burst } from './components/Celebration'
import { HABIT_COLORS, FREE_HABIT_LIMIT, type Habit } from './types'
import { isScheduled } from './lib/streaks'
import { today, toKey } from './lib/date'

function App() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleDate } = useHabits()
  const { theme, setTheme } = useTheme()
  const { user, login, logout, completeOnboarding, setPlan } = useAuth()

  const [tab, setTab] = useState<Tab>('today')
  const [selectedDate, setSelectedDate] = useState(() => today())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Habit | null>(null)
  const [detailHabit, setDetailHabit] = useState<Habit | null>(null)
  const [burst, setBurst] = useState<Burst | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const activeHabits = habits.filter((h) => !h.archived)
  const scheduledForDay = activeHabits.filter((h) => isScheduled(h, selectedDate))
  const restForDay = activeHabits.filter((h) => !isScheduled(h, selectedDate))
  const atFreeLimit = !!user && user.plan === 'free' && activeHabits.length >= FREE_HABIT_LIMIT

  if (!user) {
    return <LoginScreen onLogin={login} />
  }

  if (!user.onboarded) {
    return (
      <OnboardingFlow
        userName={user.name}
        onFinish={(habitInput, plan) => {
          addHabit(habitInput)
          setPlan(plan)
          completeOnboarding()
        }}
      />
    )
  }

  const handleToggle = (id: string, e: React.MouseEvent) => {
    const habit = habits.find((h) => h.id === id)
    if (!habit) return
    const dateKey = toKey(selectedDate)
    const willBeDone = !habit.completions.includes(dateKey)
    if (willBeDone) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setBurst({
        id: `${id}-${Date.now()}`,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        color: HABIT_COLORS[habit.color],
      })
      setTimeout(() => setBurst(null), 650)
    }
    toggleDate(id, dateKey)
  }

  const openAdd = () => {
    if (atFreeLimit) {
      setUpgradeOpen(true)
      return
    }
    setEditing(null)
    setSheetOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditing(habit)
    setDetailHabit(null)
    setSheetOpen(true)
  }

  const titles: Record<Tab, string> = { today: 'Loop', stats: 'Insights' }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-cream dark:bg-zinc-950">
      <Header
        title={titles[tab]}
        plan={user.plan}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenUpgrade={() => setUpgradeOpen(true)}
      />

      {tab === 'today' && (
        <>
          <WeekStrip selected={selectedDate} onSelect={setSelectedDate} />
          {activeHabits.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="mt-3 space-y-2 px-4 pb-28">
              {scheduledForDay.map((h) => (
                <HabitCard key={h.id} habit={h} date={selectedDate} onToggle={handleToggle} onOpen={setDetailHabit} />
              ))}
              {restForDay.length > 0 && (
                <>
                  <p className="pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    No programado este día
                  </p>
                  {restForDay.map((h) => (
                    <HabitCard key={h.id} habit={h} date={selectedDate} onToggle={handleToggle} onOpen={setDetailHabit} />
                  ))}
                </>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'stats' && (
        <StatsView habits={activeHabits} plan={user.plan} onOpen={setDetailHabit} onUpgrade={() => setUpgradeOpen(true)} />
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

      <HabitDetail
        habit={detailHabit}
        plan={user.plan}
        onClose={() => setDetailHabit(null)}
        onEdit={openEdit}
        onUpgrade={() => setUpgradeOpen(true)}
      />

      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        habitCount={activeHabits.length}
        theme={theme}
        onSetTheme={setTheme}
        onUpgrade={() => setUpgradeOpen(true)}
        onLogout={logout}
        onResetData={() => {
          if (confirm('¿Borrar todos los hábitos y empezar de nuevo?')) {
            activeHabits.forEach((h) => deleteHabit(h.id))
          }
        }}
      />

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        onSelect={(plan) => {
          setPlan(plan)
          setUpgradeOpen(false)
        }}
      />

      <Celebration burst={burst} />
    </div>
  )
}

export default App

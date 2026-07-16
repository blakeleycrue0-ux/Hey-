import { useEffect, useState } from 'react'
import { useHabits } from './hooks/useHabits'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'
import { usePrefs } from './hooks/usePrefs'
import { useRoutines, type Routine } from './hooks/useRoutines'
import { useReminders } from './hooks/useReminders'
import { Header } from './components/Header'
import { WeekStrip } from './components/WeekStrip'
import { TodayHero } from './components/TodayHero'
import { DailyTipCard } from './components/DailyTipCard'
import { HabitCard } from './components/HabitCard'
import { EmptyState } from './components/EmptyState'
import { TabBar, type Tab } from './components/TabBar'
import { AddHabitSheet } from './components/AddHabitSheet'
import { HabitDetail } from './components/HabitDetail'
import { StatsView } from './components/StatsView'
import { SettingsOverlay } from './components/SettingsOverlay'
import { ArchivedHabitsOverlay } from './components/ArchivedHabitsOverlay'
import { AchievementsOverlay } from './components/AchievementsOverlay'
import { RoutineChips } from './components/RoutineChips'
import { RoutinesOverlay } from './components/RoutinesOverlay'
import { RoutineSheet } from './components/RoutineSheet'
import { UpgradeModal } from './components/UpgradeModal'
import { OfferPopup } from './components/OfferPopup'
import { LoginScreen } from './components/LoginScreen'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'
import { Celebration, type Burst } from './components/Celebration'
import { HABIT_COLORS, FREE_HABIT_LIMIT, type Habit } from './types'
import { isScheduled, isCompletedOn } from './lib/streaks'
import { today, toKey, daysFromNow } from './lib/date'
import { loadLastOfferShown, saveLastOfferShown, loadOfferExpiry, saveOfferExpiry } from './lib/storage'

function App() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleDate, setArchived, replaceAll, setPausedUntil, setNote, setReminderTime } = useHabits()
  const { routines, addRoutine, updateRoutine, deleteRoutine } = useRoutines()
  const { prefs, updatePrefs } = usePrefs()
  useReminders(habits)
  const { theme, setTheme } = useTheme(prefs.darkByTime)
  const { user, loading, loginWithGoogle, logout, completeOnboarding, setPlan } = useAuth()

  const [tab, setTab] = useState<Tab>('today')
  const [selectedDate, setSelectedDate] = useState(() => today())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailHabitId, setDetailHabitId] = useState<string | null>(null)
  const [burst, setBurst] = useState<Burst | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [upgradeOffer, setUpgradeOffer] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [archivedOpen, setArchivedOpen] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [offerPopupOpen, setOfferPopupOpen] = useState(false)
  const [routinesOpen, setRoutinesOpen] = useState(false)
  const [routineSheetOpen, setRoutineSheetOpen] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [offerExpiry, setOfferExpiry] = useState<number | null>(() => loadOfferExpiry())

  useEffect(() => {
    if (!user?.onboarded || user.plan !== 'free') return
    const todayKey = new Date().toISOString().slice(0, 10)
    if (loadLastOfferShown() === todayKey) return
    const timer = setTimeout(() => {
      let expiry = loadOfferExpiry()
      if (!expiry || expiry < Date.now()) {
        expiry = Date.now() + 2 * 60 * 60 * 1000
        saveOfferExpiry(expiry)
      }
      setOfferExpiry(expiry)
      setOfferPopupOpen(true)
      saveLastOfferShown()
    }, 5000)
    return () => clearTimeout(timer)
  }, [user?.id, user?.onboarded, user?.plan])

  const openUpgrade = (offer = false) => {
    setUpgradeOffer(offer)
    setUpgradeOpen(true)
  }

  const activeHabits = habits.filter((h) => !h.archived)
  const archivedHabits = habits.filter((h) => h.archived)
  const editing = habits.find((h) => h.id === editingId) ?? null
  const detailHabit = habits.find((h) => h.id === detailHabitId) ?? null
  let scheduledForDay = activeHabits.filter((h) => isScheduled(h, selectedDate))
  const restForDay = activeHabits.filter((h) => !isScheduled(h, selectedDate))
  const atFreeLimit = !!user && user.plan === 'free' && activeHabits.length >= FREE_HABIT_LIMIT

  if (prefs.autoSortDone) {
    scheduledForDay = [...scheduledForDay].sort((a, b) => {
      const aDone = isCompletedOn(a, selectedDate) ? 1 : 0
      const bDone = isCompletedOn(b, selectedDate) ? 1 : 0
      return aDone - bDone
    })
  }

  if (loading) {
    return <div className="min-h-screen bg-cream dark:bg-zinc-950" />
  }

  if (!user) {
    return <LoginScreen onLogin={loginWithGoogle} />
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

  const handleCompleteRoutine = (habitIds: string[]) => {
    const dateKey = toKey(selectedDate)
    habitIds.forEach((id) => {
      const habit = habits.find((h) => h.id === id)
      if (habit && !habit.completions.includes(dateKey)) toggleDate(id, dateKey)
    })
  }

  const openAdd = () => {
    if (atFreeLimit) {
      openUpgrade()
      return
    }
    setEditingId(null)
    setSheetOpen(true)
  }

  const openEdit = (habit: Habit) => {
    setEditingId(habit.id)
    setDetailHabitId(null)
    setSheetOpen(true)
  }

  const titles: Record<Tab, string> = { today: 'Loop', stats: 'Insights' }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-cream dark:bg-zinc-950">
      <Header
        title={titles[tab]}
        plan={user.plan}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenUpgrade={() => openUpgrade()}
      />

      {tab === 'today' && (
        <>
          <WeekStrip selected={selectedDate} onSelect={setSelectedDate} weekStartsOn={prefs.weekStartsOn} />
          <TodayHero habits={habits} />
          <DailyTipCard />
          <RoutineChips routines={routines} habits={activeHabits} date={selectedDate} onComplete={handleCompleteRoutine} />
          {activeHabits.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="space-y-2 px-4 pb-28">
              {scheduledForDay.map((h) => (
                <HabitCard key={h.id} habit={h} date={selectedDate} onToggle={handleToggle} onOpen={(h) => setDetailHabitId(h.id)} />
              ))}
              {restForDay.length > 0 && (
                <>
                  <p className="pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    No programado este día
                  </p>
                  {restForDay.map((h) => (
                    <HabitCard key={h.id} habit={h} date={selectedDate} onToggle={handleToggle} onOpen={(h) => setDetailHabitId(h.id)} />
                  ))}
                </>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'stats' && (
        <StatsView habits={activeHabits} plan={user.plan} onOpen={(h) => setDetailHabitId(h.id)} onUpgrade={() => openUpgrade()} />
      )}

      <TabBar tab={tab} onChange={setTab} onAdd={openAdd} />

      <AddHabitSheet
        open={sheetOpen}
        editing={editing}
        onClose={() => setSheetOpen(false)}
        onSave={(input, reminderTime) => {
          if (editing) {
            updateHabit(editing.id, input)
            setReminderTime(editing.id, reminderTime)
          } else {
            const created = addHabit(input)
            setReminderTime(created.id, reminderTime)
          }
        }}
        onDelete={deleteHabit}
        onArchive={(id) => setArchived(id, true)}
      />

      <HabitDetail
        habit={detailHabit}
        plan={user.plan}
        onClose={() => setDetailHabitId(null)}
        onEdit={openEdit}
        onUpgrade={() => openUpgrade()}
        onPause={(id, days) => setPausedUntil(id, toKey(daysFromNow(days)))}
        onResume={(id) => setPausedUntil(id, undefined)}
        onSaveNote={setNote}
      />

      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        habits={habits}
        archivedCount={archivedHabits.length}
        theme={theme}
        onSetTheme={setTheme}
        prefs={prefs}
        onUpdatePrefs={updatePrefs}
        onUpgrade={() => openUpgrade()}
        onLogout={logout}
        onResetData={() => {
          if (confirm('¿Borrar todos los hábitos y empezar de nuevo?')) {
            replaceAll([])
          }
        }}
        onOpenArchived={() => setArchivedOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenRoutines={() => setRoutinesOpen(true)}
        onImportHabits={(imported) => {
          if (confirm(`¿Importar ${imported.length} hábito(s)? Esto reemplaza tus hábitos actuales.`)) {
            replaceAll(imported)
          }
        }}
      />

      <ArchivedHabitsOverlay
        open={archivedOpen}
        habits={archivedHabits}
        onClose={() => setArchivedOpen(false)}
        onRestore={(id) => setArchived(id, false)}
        onDelete={deleteHabit}
      />

      <AchievementsOverlay open={achievementsOpen} habits={habits} onClose={() => setAchievementsOpen(false)} />

      <RoutinesOverlay
        open={routinesOpen}
        routines={routines}
        habits={activeHabits}
        onClose={() => setRoutinesOpen(false)}
        onAdd={() => {
          setEditingRoutine(null)
          setRoutineSheetOpen(true)
        }}
        onEdit={(r) => {
          setEditingRoutine(r)
          setRoutineSheetOpen(true)
        }}
      />

      <RoutineSheet
        open={routineSheetOpen}
        editing={editingRoutine}
        habits={activeHabits}
        onClose={() => setRoutineSheetOpen(false)}
        onSave={(input) => {
          if (editingRoutine) updateRoutine(editingRoutine.id, input)
          else addRoutine(input)
        }}
        onDelete={deleteRoutine}
      />

      <UpgradeModal
        open={upgradeOpen}
        offer={upgradeOffer}
        onClose={() => setUpgradeOpen(false)}
        onSelect={(plan) => {
          setPlan(plan)
          setUpgradeOpen(false)
        }}
      />

      <OfferPopup
        open={offerPopupOpen}
        expiresAt={offerExpiry}
        onAccept={() => {
          setOfferPopupOpen(false)
          openUpgrade(true)
        }}
        onDismiss={() => setOfferPopupOpen(false)}
      />

      <Celebration burst={burst} />
    </div>
  )
}

export default App

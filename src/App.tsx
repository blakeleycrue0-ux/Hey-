import { useEffect, useState } from 'react'
import { useEvents } from './hooks/useEvents'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'
import { usePrefs } from './hooks/usePrefs'
import { useReminders } from './hooks/useReminders'
import { Header } from './components/Header'
import { EventHero } from './components/EventHero'
import { DailyTipCard } from './components/DailyTipCard'
import { EventCard } from './components/EventCard'
import { EmptyState } from './components/EmptyState'
import { TabBar, type Tab } from './components/TabBar'
import { AddEventSheet } from './components/AddEventSheet'
import { EventDetail } from './components/EventDetail'
import { StatsView } from './components/StatsView'
import { SettingsOverlay } from './components/SettingsOverlay'
import { ArchivedEventsOverlay } from './components/ArchivedEventsOverlay'
import { AchievementsOverlay } from './components/AchievementsOverlay'
import { UpgradeModal } from './components/UpgradeModal'
import { OfferPopup } from './components/OfferPopup'
import { LoginScreen } from './components/LoginScreen'
import { OnboardingFlow } from './components/onboarding/OnboardingFlow'
import { Celebration, type Burst } from './components/Celebration'
import { FREE_EVENT_LIMIT, type HEvent } from './types'
import { daysUntil } from './lib/countdown'
import { loadLastOfferShown, saveLastOfferShown, loadOfferExpiry, saveOfferExpiry } from './lib/storage'

function App() {
  const { events, addEvent, updateEvent, deleteEvent, setArchived, replaceAll, setReminderDaysBefore } = useEvents()
  const { prefs, updatePrefs } = usePrefs()
  useReminders(events)
  const { theme, setTheme } = useTheme(prefs.darkByTime)
  const { user, loading, loginWithGoogle, logout, completeOnboarding, setPlan } = useAuth()

  const [tab, setTab] = useState<Tab>('today')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [detailEventId, setDetailEventId] = useState<string | null>(null)
  const [burst, setBurst] = useState<Burst | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [upgradeOffer, setUpgradeOffer] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [archivedOpen, setArchivedOpen] = useState(false)
  const [achievementsOpen, setAchievementsOpen] = useState(false)
  const [offerPopupOpen, setOfferPopupOpen] = useState(false)
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

  const activeEvents = events.filter((e) => !e.archived)
  const archivedEvents = events.filter((e) => e.archived)
  const editing = events.find((e) => e.id === editingId) ?? null
  const detailEvent = events.find((e) => e.id === detailEventId) ?? null
  const atFreeLimit = !!user && user.plan === 'free' && activeEvents.length >= FREE_EVENT_LIMIT

  const upcoming = [...activeEvents].filter((e) => daysUntil(e) >= 0).sort((a, b) => daysUntil(a) - daysUntil(b))
  const past = [...activeEvents].filter((e) => daysUntil(e) < 0).sort((a, b) => daysUntil(b) - daysUntil(a))
  const nearest = upcoming[0] ?? null
  const restUpcoming = nearest ? upcoming.slice(1) : upcoming

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
        onFinish={(eventInput, plan) => {
          addEvent(eventInput)
          setPlan(plan)
          completeOnboarding()
        }}
      />
    )
  }

  const openAdd = () => {
    if (atFreeLimit) {
      openUpgrade()
      return
    }
    setEditingId(null)
    setSheetOpen(true)
  }

  const openEdit = (event: HEvent) => {
    setEditingId(event.id)
    setDetailEventId(null)
    setSheetOpen(true)
  }

  const titles: Record<Tab, string> = { today: 'Loop', stats: 'Resumen' }

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
          {nearest && <EventHero event={nearest} onOpen={(e) => setDetailEventId(e.id)} />}
          <DailyTipCard />
          {activeEvents.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="space-y-2 px-4 pb-28">
              {restUpcoming.map((e) => (
                <EventCard key={e.id} event={e} onOpen={(ev) => setDetailEventId(ev.id)} />
              ))}
              {past.length > 0 && (
                <>
                  <p className="pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Ya pasaron
                  </p>
                  {past.map((e) => (
                    <EventCard key={e.id} event={e} onOpen={(ev) => setDetailEventId(ev.id)} />
                  ))}
                </>
              )}
            </div>
          )}
        </>
      )}

      {tab === 'stats' && (
        <StatsView events={activeEvents} plan={user.plan} onOpen={(e) => setDetailEventId(e.id)} onUpgrade={() => openUpgrade()} />
      )}

      <TabBar tab={tab} onChange={setTab} onAdd={openAdd} />

      <AddEventSheet
        open={sheetOpen}
        editing={editing}
        onClose={() => setSheetOpen(false)}
        onSave={(input, reminderDaysBefore) => {
          if (editing) {
            updateEvent(editing.id, input)
            setReminderDaysBefore(editing.id, reminderDaysBefore)
          } else {
            const created = addEvent(input)
            setReminderDaysBefore(created.id, reminderDaysBefore)
            setBurst({ id: `add-${Date.now()}`, x: window.innerWidth / 2, y: window.innerHeight - 90, color: '#111111' })
            setTimeout(() => setBurst(null), 650)
          }
        }}
        onDelete={deleteEvent}
        onArchive={(id) => setArchived(id, true)}
      />

      <EventDetail event={detailEvent} onClose={() => setDetailEventId(null)} onEdit={openEdit} />

      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        events={events}
        archivedCount={archivedEvents.length}
        theme={theme}
        onSetTheme={setTheme}
        prefs={prefs}
        onUpdatePrefs={updatePrefs}
        onUpgrade={() => openUpgrade()}
        onLogout={logout}
        onResetData={() => {
          if (confirm('¿Borrar todos los eventos y empezar de nuevo?')) {
            replaceAll([])
          }
        }}
        onOpenArchived={() => setArchivedOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onImportEvents={(imported) => {
          if (confirm(`¿Importar ${imported.length} evento(s)? Esto reemplaza tus eventos actuales.`)) {
            replaceAll(imported)
          }
        }}
      />

      <ArchivedEventsOverlay
        open={archivedOpen}
        events={archivedEvents}
        onClose={() => setArchivedOpen(false)}
        onRestore={(id) => setArchived(id, false)}
        onDelete={deleteEvent}
      />

      <AchievementsOverlay open={achievementsOpen} events={events} onClose={() => setAchievementsOpen(false)} />

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

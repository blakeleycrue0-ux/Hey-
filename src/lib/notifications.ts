export const notificationsSupported = (): boolean => typeof window !== 'undefined' && 'Notification' in window

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!notificationsSupported()) return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

export const notifyHabitReminder = (habitName: string): void => {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  new Notification('Loop', { body: `Toca para recordar: ${habitName}`, tag: `loop-${habitName}` })
}

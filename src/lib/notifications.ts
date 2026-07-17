export const notificationsSupported = (): boolean => typeof window !== 'undefined' && 'Notification' in window

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!notificationsSupported()) return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

export const notifyEventReminder = (eventName: string, daysLeft: number): void => {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  const body = daysLeft === 0 ? `${eventName} es hoy` : daysLeft === 1 ? `${eventName} es mañana` : `Quedan ${daysLeft} días para ${eventName}`
  new Notification('Loop', { body, tag: `loop-${eventName}` })
}

import { addDays, format, parseISO, subDays, isSameDay as isSameDayFns } from 'date-fns'

export const toKey = (date: Date): string => format(date, 'yyyy-MM-dd')

export const keyToDate = (key: string): Date => parseISO(key)

export const today = (): Date => new Date()

export const todayKey = (): string => toKey(today())

export const isSameDay = (a: Date, b: Date): boolean => isSameDayFns(a, b)

export const daysAgo = (n: number): Date => subDays(today(), n)

export const daysFromNow = (n: number): Date => addDays(today(), n)

export const weekdayOf = (date: Date): number => date.getDay()

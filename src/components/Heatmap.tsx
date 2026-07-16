import { useMemo } from 'react'
import type { Habit } from '../types'
import { HABIT_COLORS } from '../types'
import { isCompletedOn, isScheduled } from '../lib/streaks'
import { daysAgo, weekdayOf } from '../lib/date'

interface Props {
  habit: Habit
  weeks?: number
}

export const Heatmap = ({ habit, weeks = 18 }: Props) => {
  const palette = HABIT_COLORS[habit.color]
  const totalDays = weeks * 7

  const columns = useMemo(() => {
    // Build a flat list of the last `totalDays`, oldest first, then chunk into weeks
    // aligned so each column is a week (Sun-Sat).
    const todayOffset = weekdayOf(daysAgo(0))
    const start = totalDays - 1 + (6 - todayOffset)
    const cells: { date: Date; done: boolean; scheduled: boolean; inRange: boolean }[] = []
    for (let i = start; i >= 0; i--) {
      const date = daysAgo(i)
      cells.push({
        date,
        done: isCompletedOn(habit, date),
        scheduled: isScheduled(habit, date),
        inRange: i <= totalDays - 1,
      })
    }
    const cols: typeof cells[] = []
    for (let i = 0; i < cells.length; i += 7) {
      cols.push(cells.slice(i, i + 7))
    }
    return cols
  }, [habit, totalDays])

  return (
    <div className="flex gap-[3px] overflow-x-auto pb-1">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-[3px]">
          {col.map((cell, ri) => (
            <div
              key={ri}
              title={cell.date.toDateString()}
              className="h-3 w-3 rounded-[3px]"
              style={{
                background: !cell.inRange
                  ? 'transparent'
                  : cell.done
                    ? `linear-gradient(135deg, ${palette.from}, ${palette.to})`
                    : cell.scheduled
                      ? 'rgba(128,128,128,0.15)'
                      : 'rgba(128,128,128,0.06)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

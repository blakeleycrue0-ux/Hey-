import type { Habit } from '../types'
import { perfectDayStreak } from './streaks'

const WIDTH = 1080
const HEIGHT = 1920

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export const generateStreakImage = async (habits: Habit[]): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas not supported')

  ctx.fillStyle = '#111111'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  try {
    const mark = await loadImage('/icons/mark.png')
    const size = 96
    ctx.save()
    ctx.beginPath()
    const r = size * 0.26
    const x = (WIDTH - size) / 2
    const y = 160
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + size, y, x + size, y + size, r)
    ctx.arcTo(x + size, y + size, x, y + size, r)
    ctx.arcTo(x, y + size, x, y, r)
    ctx.arcTo(x, y, x + size, y, r)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(mark, x, y, size, size)
    ctx.restore()
  } catch {
    // logo is a nice-to-have; keep going without it
  }

  const streak = perfectDayStreak(habits)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 220px system-ui, -apple-system, sans-serif'
  ctx.fillText(String(streak), WIDTH / 2, 620)

  ctx.font = '500 44px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText(streak === 1 ? 'día de racha perfecta' : 'días de racha perfecta', WIDTH / 2, 690)

  const active = habits.filter((h) => !h.archived).slice(0, 6)
  let listY = 880
  ctx.textAlign = 'left'
  active.forEach((h) => {
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    roundRect(ctx, 90, listY, WIDTH - 180, 120, 28)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = '600 40px system-ui, -apple-system, sans-serif'
    ctx.fillText(h.name, 130, listY + 74)
    listY += 148
  })

  ctx.textAlign = 'center'
  ctx.font = '700 48px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Loop', WIDTH / 2, HEIGHT - 120)
  ctx.font = '400 32px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('Construye hábitos que de verdad se quedan', WIDTH / 2, HEIGHT - 70)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png')
  })
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export const shareStreakImage = async (habits: Habit[]): Promise<void> => {
  const blob = await generateStreakImage(habits)
  const file = new File([blob], 'loop-racha.png', { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Mi racha en Loop' })
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'loop-racha.png'
  a.click()
  URL.revokeObjectURL(url)
}

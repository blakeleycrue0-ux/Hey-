import type { HEvent } from '../types'
import { EVENT_COLORS } from '../types'
import { daysUntil, gridDots } from './countdown'

const WIDTH = 1080
const HEIGHT = 1920

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export const generateEventImage = async (event: HEvent): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas not supported')

  const color = EVENT_COLORS[event.color]

  ctx.fillStyle = color
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  try {
    const mark = await loadImage('/icons/mark.png')
    const size = 96
    ctx.save()
    ctx.beginPath()
    const r = size * 0.26
    const x = (WIDTH - size) / 2
    const y = 140
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

  const days = daysUntil(event)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 210px system-ui, -apple-system, sans-serif'
  ctx.fillText(String(Math.abs(days)), WIDTH / 2, 620)

  ctx.font = '500 42px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText(days >= 0 ? 'días para' : 'días desde', WIDTH / 2, 690)

  ctx.font = '600 52px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#ffffff'
  wrapText(ctx, event.name, WIDTH / 2, 800, WIDTH - 200, 62)

  const { total, elapsed } = gridDots(event, new Date(), 260)
  drawDotGrid(ctx, total, elapsed, WIDTH / 2, 1050, 16, 10, 8)

  ctx.textAlign = 'center'
  ctx.font = '700 48px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText('Loop', WIDTH / 2, HEIGHT - 120)
  ctx.font = '400 32px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText('Cuenta atrás para lo que de verdad importa', WIDTH / 2, HEIGHT - 70)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))), 'image/png')
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  const lines: string[] = []
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, cx, y + i * lineHeight))
}

function drawDotGrid(ctx: CanvasRenderingContext2D, total: number, elapsed: number, cx: number, top: number, size: number, gap: number, columns: number) {
  const rows = Math.ceil(total / columns)
  const gridWidth = columns * size + (columns - 1) * gap
  const startX = cx - gridWidth / 2
  for (let i = 0; i < total; i++) {
    const col = i % columns
    const row = Math.floor(i / columns)
    const x = startX + col * (size + gap) + size / 2
    const y = top + row * (size + gap) + size / 2
    ctx.beginPath()
    ctx.arc(x, y, size / 2, 0, Math.PI * 2)
    if (i < elapsed) {
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 2
      ctx.stroke()
    } else {
      ctx.fillStyle = '#ffffff'
      ctx.fill()
    }
  }
  return rows
}

export const shareEventImage = async (event: HEvent): Promise<void> => {
  const blob = await generateEventImage(event)
  const file = new File([blob], 'loop-cuenta-atras.png', { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: `Mi cuenta atrás para ${event.name} en Loop` })
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'loop-cuenta-atras.png'
  a.click()
  URL.revokeObjectURL(url)
}

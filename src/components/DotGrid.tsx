interface Props {
  total: number
  elapsed: number
  color: string
  size?: number
  gap?: number
  columns?: number
}

/** A grid of dots representing a countdown: solid dots are days left, hollow ones have passed. */
export const DotGrid = ({ total, elapsed, color, size = 6, gap = 5, columns }: Props) => {
  const cols = columns ?? Math.max(4, Math.round(Math.sqrt(total * 2.2)))

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap, justifyContent: 'center' }}
    >
      {Array.from({ length: total }).map((_, i) =>
        i < elapsed ? (
          <span
            key={i}
            className="rounded-full"
            style={{ width: size, height: size, border: `1.5px solid ${color}`, opacity: 0.25 }}
          />
        ) : (
          <span key={i} className="rounded-full" style={{ width: size, height: size, background: color }} />
        ),
      )}
    </div>
  )
}

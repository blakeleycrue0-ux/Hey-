import { AnimatePresence, motion } from 'framer-motion'

interface Burst {
  id: string
  x: number
  y: number
  color: string
}

const PARTICLE_COUNT = 10

export const Celebration = ({ burst }: { burst: Burst | null }) => (
  <AnimatePresence>
    {burst && (
      <div
        key={burst.id}
        className="pointer-events-none fixed z-50"
        style={{ left: burst.x, top: burst.y }}
      >
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
          const angle = (i / PARTICLE_COUNT) * Math.PI * 2
          const distance = 42 + Math.random() * 24
          return (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{ background: burst.color, left: -4, top: -4 }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              animate={{
                opacity: 0,
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                scale: 0.3,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )
        })}
      </div>
    )}
  </AnimatePresence>
)

export type { Burst }

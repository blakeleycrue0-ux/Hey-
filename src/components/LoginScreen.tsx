import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Mail, User } from 'lucide-react'
import { BRAND } from '../types'

interface Props {
  onLogin: (name: string, email: string) => void
}

export const LoginScreen = ({ onLogin }: Props) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const canSubmit = name.trim().length > 0 && /\S+@\S+\.\S+/.test(email)

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto w-full max-w-sm"
      >
        <div
          className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[26px] shadow-xl"
          style={{ background: BRAND, boxShadow: `0 16px 32px -12px ${BRAND}66` }}
        >
          <Flame size={36} className="text-white" fill="white" />
        </div>
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Bienvenido a Loop
        </h1>
        <p className="mt-2 text-center text-[15px] text-zinc-500 dark:text-zinc-400">
          Construye hábitos que de verdad se quedan.
        </p>

        <form
          className="mt-9 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (canSubmit) onLogin(name, email)
          }}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-white/[0.06] px-4 py-3.5 shadow-sm">
            <User size={18} className="text-zinc-400" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-transparent text-[15px] text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400"
            />
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-white/[0.06] px-4 py-3.5 shadow-sm">
            <Mail size={18} className="text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-transparent text-[15px] text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-2xl py-3.5 text-[15px] font-semibold text-white shadow-lg transition-opacity disabled:opacity-40"
            style={{ background: BRAND }}
          >
            Continuar
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-zinc-400">
          Tus datos se guardan solo en este dispositivo.
        </p>
      </motion.div>
    </div>
  )
}

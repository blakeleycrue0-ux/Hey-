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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-sm"
      >
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: BRAND }}
        >
          <Flame size={30} className="text-white" fill="white" />
        </div>
        <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">Loop</h1>
        <p className="mt-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Construye hábitos que se quedan.
        </p>

        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (canSubmit) onLogin(name, email)
          }}
        >
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3">
            <User size={18} className="text-zinc-400" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3">
            <Mail size={18} className="text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            style={{ background: BRAND }}
          >
            Continuar
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Tus datos se guardan solo en este dispositivo.
        </p>
      </motion.div>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'

export function SectionHeader({
  kanji,
  eyebrow,
  title,
  description,
}: {
  kanji: string
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="relative mb-8 flex items-start gap-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden shrink-0 items-center justify-center rounded-2xl border border-border bg-card font-jp-serif text-5xl font-black text-primary sm:flex sm:h-24 sm:w-24"
      >
        {kanji}
      </motion.div>
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] uppercase tracking-[0.32em] text-primary"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-2 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 max-w-xl text-pretty leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>
      </div>
    </div>
  )
}

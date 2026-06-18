'use client'

import { motion } from 'framer-motion'
import { NORTH_STAR } from '@/lib/data'
import { SectionHeader } from '@/components/section-header'

const accentMap = {
  primary: 'var(--primary)',
  aoi: 'var(--aoi)',
  gold: 'var(--gold)',
} as const

export function NorthStar() {
  return (
    <section>
      <SectionHeader
        kanji="北"
        eyebrow="North Star · 2026—2027"
        title="The only three things that matter"
        description="Track outputs, not intentions. Everything you build over the next chapter points back to these three directions."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {NORTH_STAR.map((goal, i) => (
          <motion.article
            key={goal.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6"
          >
            <span
              className="pointer-events-none absolute -right-4 -top-6 font-jp-serif text-[7rem] font-black leading-none opacity-[0.07] transition-opacity group-hover:opacity-[0.12]"
              style={{ color: accentMap[goal.accent] }}
            >
              {goal.kanji}
            </span>
            <div
              className="mb-5 h-1 w-12 rounded-full"
              style={{ background: accentMap[goal.accent] }}
            />
            <p className="font-jp-serif text-2xl font-bold" style={{ color: accentMap[goal.accent] }}>
              {goal.kanji}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{goal.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{goal.body}</p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 rounded-2xl border border-border bg-secondary/30 p-6"
      >
        <p className="font-jp-serif text-sm text-primary">使命</p>
        <p className="mt-1 text-pretty text-lg font-medium leading-relaxed">
          {'Score 85%+ for 8 consecutive weeks. Keep everything in one place, prevent overwhelm, and progress in Japanese, programming, and university simultaneously.'}
        </p>
      </motion.div>
    </section>
  )
}

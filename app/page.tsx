'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { KanjiField } from '@/components/kanji-field'
import { SakuraPetals } from '@/components/sakura-petals'
import { Sidebar, MobileNav, type SectionId } from '@/components/sidebar'
import { Dashboard } from '@/components/sections/dashboard'
import { Metrics } from '@/components/sections/metrics'
import { Schedule } from '@/components/sections/schedule'
import { Japanese } from '@/components/sections/japanese'
import { Programming } from '@/components/sections/programming'
import { Review } from '@/components/sections/review'

const SECTIONS: Record<SectionId, React.ComponentType<{ onNavigate: (id: SectionId) => void }>> = {
  dashboard: Dashboard,
  metrics: Metrics,
  schedule: Schedule,
  japanese: Japanese,
  programming: Programming,
  review: Review,
}

export default function Page() {
  const [active, setActive] = useState<SectionId>('dashboard')
  const Section = SECTIONS[active]

  // Rendered only after mount so the locale/timezone date can't cause a
  // server/client hydration mismatch.
  const [today, setToday] = useState('')
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    )
  }, [])

  return (
    <div className="relative flex min-h-svh">
      <KanjiField />
      <SakuraPetals />
      <Sidebar active={active} onChange={setActive} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <MobileNav active={active} onChange={setActive} />

        <header className="hidden items-center justify-between px-8 pt-8 lg:flex">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-jp-serif text-primary">今日</span>
            {today}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">One place · stay focused</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Section onNavigate={setActive} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

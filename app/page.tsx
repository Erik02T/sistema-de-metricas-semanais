'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { KanjiField } from '@/components/kanji-field'
import { Sidebar, MobileNav, type SectionId } from '@/components/sidebar'
import { NorthStar } from '@/components/sections/north-star'
import { Scorecard } from '@/components/sections/scorecard'
import { Schedule } from '@/components/sections/schedule'
import { Japanese } from '@/components/sections/japanese'
import { Programming } from '@/components/sections/programming'
import { Review } from '@/components/sections/review'
import { computeScores, usePOS } from '@/lib/store'

const SECTIONS: Record<SectionId, React.ComponentType> = {
  'north-star': NorthStar,
  scorecard: Scorecard,
  schedule: Schedule,
  japanese: Japanese,
  programming: Programming,
  review: Review,
}

export default function Page() {
  const [active, setActive] = useState<SectionId>('north-star')
  const results = usePOS((s) => s.results)
  const { final } = computeScores(results)
  const Section = SECTIONS[active]

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="relative flex min-h-svh">
      <KanjiField />
      <Sidebar active={active} onChange={setActive} finalScore={final} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <MobileNav active={active} onChange={setActive} />

        <header className="hidden items-center justify-between px-8 pt-8 lg:flex">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-jp-serif text-primary">今日</span>
            {today}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Focus mode · 8-week sprint</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Section />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

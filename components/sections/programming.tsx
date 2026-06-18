'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PROG_LOOP, PROG_WEEKS } from '@/lib/data'
import { usePOS } from '@/lib/store'
import { ProgressRing } from '@/components/progress-ring'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'

export function Programming() {
  const progDone = usePOS((s) => s.progDone)
  const toggleProg = usePOS((s) => s.toggleProg)
  const doneCount = PROG_WEEKS.filter((w) => progDone[w.id]).length
  const pct = Math.round((doneCount / PROG_WEEKS.length) * 100)

  return (
    <section>
      <SectionHeader
        kanji="工"
        eyebrow="Programming Dashboard"
        title="Logic & computational thinking"
        description="Eight weeks of fundamentals. No new frameworks, no hype — just the building blocks, mastered one at a time."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROG_WEEKS.map((w, i) => {
              const done = !!progDone[w.id]
              return (
                <motion.button
                  key={w.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => toggleProg(w.id)}
                  className={cn(
                    'group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-colors',
                    done ? 'border-aoi/40 bg-aoi/5' : 'border-border bg-card hover:border-aoi/30',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-jp-serif text-2xl font-black transition-colors',
                      done ? 'text-aoi' : 'text-foreground/20',
                    )}
                    style={{ background: 'var(--background)' }}
                  >
                    {w.kanji}
                  </span>
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      Week {w.week}
                    </p>
                    <p className="text-sm font-semibold">{w.topic}</p>
                  </div>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
                      done ? 'border-transparent bg-aoi text-background' : 'border-border',
                    )}
                  >
                    {done && <Check className="h-4 w-4" />}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center"
          >
            <ProgressRing value={pct} size={120} stroke={9} color="var(--aoi)" label={`${pct}%`} sublabel="Stage" />
            <p className="mt-3 font-jp-serif text-sm text-aoi">論理思考</p>
            <p className="text-sm text-muted-foreground">
              {doneCount} / {PROG_WEEKS.length} weeks complete
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <p className="font-jp-serif text-sm text-aoi">習得 · Mastery Loop</p>
            <p className="mb-4 mt-1 text-xs text-muted-foreground">For every topic</p>
            <ol className="space-y-2.5">
              {PROG_LOOP.map((step, i) => (
                <li key={step} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border font-mono text-xs text-aoi">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

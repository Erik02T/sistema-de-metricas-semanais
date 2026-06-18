'use client'

import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { SCHEDULE, type ScheduleBlock } from '@/lib/data'
import { SectionHeader } from '@/components/section-header'

const areaColor: Record<ScheduleBlock['area'], string> = {
  japanese: 'var(--primary)',
  programming: 'var(--aoi)',
  university: 'var(--gold)',
  deep: 'var(--success)',
  review: 'var(--foreground)',
}

export function Schedule() {
  return (
    <section>
      <SectionHeader
        kanji="週"
        eyebrow="Weekly Schedule"
        title="One rhythm, repeated"
        description="A fixed weekly cadence removes daily decision fatigue. Show up, follow the block, log the output."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SCHEDULE.map((day, i) => (
          <motion.article
            key={day.day}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.45 }}
            whileHover={{ y: -3 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">{day.day}</h3>
              <span className="font-jp-serif text-3xl font-black text-foreground/10">
                {day.kanji}
              </span>
            </div>

            <div className="space-y-3">
              {day.blocks.map((block) => (
                <div
                  key={block.title}
                  className="rounded-xl border border-border/70 bg-background/40 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="flex items-center gap-2 text-sm font-medium"
                      style={{ color: areaColor[block.area] }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: areaColor[block.area] }}
                      />
                      {block.title}
                    </span>
                    {block.duration && (
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {block.duration}
                      </span>
                    )}
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

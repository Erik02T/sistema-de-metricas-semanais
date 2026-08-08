'use client'

import { motion } from 'framer-motion'
import { useOS } from '@/lib/store'
import { REVIEW_AREAS, REFLECTION_QUESTIONS } from '@/lib/data'
import { SectionHeader } from '@/components/section-header'
import { WeekSwitcher } from '@/components/week-switcher'
import { Field, Textarea } from '@/components/ui/primitives'

export function Review() {
  const activeWeek = useOS((s) => s.activeWeek)
  const review = useOS((s) => s.review)
  const setReview = useOS((s) => s.setReview)

  const weekData = review[activeWeek] ?? {}
  const val = (key: string) => weekData[key] ?? ''

  return (
    <div>
      <SectionHeader
        kanji="省"
        eyebrow="Weekly Review"
        title="Reflect & consolidate"
        description="Close the loop every week. Write down what you learned across each area, then answer the reflection prompts."
      />

      <div className="mb-6">
        <WeekSwitcher />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {REVIEW_AREAS.map((area, i) => (
          <motion.div
            key={area.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary font-jp-serif text-primary">
                {area.kanji}
              </span>
              <h3 className="text-sm font-semibold">{area.label}</h3>
            </div>
            <div className="flex flex-col gap-3">
              {area.fields.map((f) => (
                <Field key={f.key} label={f.label}>
                  <Textarea
                    rows={2}
                    value={val(`${area.id}.${f.key}`)}
                    onChange={(e) => setReview(activeWeek, `${area.id}.${f.key}`, e.target.value)}
                    placeholder="…"
                  />
                </Field>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-jp-serif text-primary-foreground">
            省
          </span>
          <div>
            <h3 className="text-sm font-semibold">Reflection</h3>
            <p className="font-jp-serif text-xs text-primary">振り返り</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {REFLECTION_QUESTIONS.map((q) => (
            <Field key={q.key} label={q.label}>
              <Textarea
                rows={2}
                value={val(`reflection.${q.key}`)}
                onChange={(e) => setReview(activeWeek, `reflection.${q.key}`, e.target.value)}
                placeholder="…"
              />
            </Field>
          ))}
        </div>
      </motion.div>

      <p className="mt-6 text-center font-jp-serif text-sm text-muted-foreground">
        七転び八起き · Fall seven times, stand up eight
      </p>
    </div>
  )
}

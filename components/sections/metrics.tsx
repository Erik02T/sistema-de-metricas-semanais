'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useOS } from '@/lib/store'
import { AREAS, DAY_KANJI } from '@/lib/data'
import { DAYS, type AreaId, type Day, type DayMetric } from '@/lib/types'
import { durationToMinutes, formatMinutes } from '@/lib/week'
import { SectionHeader } from '@/components/section-header'
import { WeekSwitcher } from '@/components/week-switcher'
import { Field, Input, Textarea } from '@/components/ui/primitives'

const empty: DayMetric = { passive: '', active: '', annotations: '', observations: '' }

export function Metrics() {
  const [area, setArea] = useState<AreaId>('japanese')
  const activeWeek = useOS((s) => s.activeWeek)
  const metrics = useOS((s) => s.metrics)
  const setMetric = useOS((s) => s.setMetric)

  const weekData = metrics[activeWeek]?.[area] ?? {}

  const totalMin = DAYS.reduce((acc, d) => {
    const m = weekData[d]
    return acc + durationToMinutes(m?.passive ?? '') + durationToMinutes(m?.active ?? '')
  }, 0)

  return (
    <div>
      <SectionHeader
        kanji="録"
        eyebrow="Weekly Metrics"
        title="Record your week"
        description="Log passive study, active study and annotations for each day. Everything is saved automatically per week."
      />

      <WeekSwitcher />

      {/* Area tabs */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {AREAS.map((a) => {
          const isActive = a.id === area
          return (
            <button
              key={a.id}
              onClick={() => setArea(a.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-transparent text-background'
                  : 'border-border bg-card/60 text-muted-foreground hover:text-foreground',
              )}
              style={isActive ? { background: a.color } : undefined}
            >
              <span className="font-jp-serif">{a.kanji}</span>
              {a.label}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: AREAS.find((a) => a.id === area)?.dot }}
        />
        Total studied this week:{' '}
        <span className="font-mono font-semibold text-foreground">{formatMinutes(totalMin)}</span>
      </div>

      {/* Day cards */}
      <div className="mt-5 grid gap-4">
        {DAYS.map((day) => (
          <DayCard
            key={day}
            day={day}
            value={weekData[day] ?? empty}
            onChange={(patch) => setMetric(activeWeek, area, day, patch)}
          />
        ))}
      </div>
    </div>
  )
}

function DayCard({
  day,
  value,
  onChange,
}: {
  day: Day
  value: DayMetric
  onChange: (patch: Partial<DayMetric>) => void
}) {
  const dayMin = durationToMinutes(value.passive) + durationToMinutes(value.active)
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-jp-serif text-lg text-primary">
            {DAY_KANJI[day]}
          </span>
          <h3 className="font-heading text-base font-semibold">{day}</h3>
        </div>
        {dayMin > 0 && (
          <span className="font-mono text-xs text-muted-foreground">{formatMinutes(dayMin)}</span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Passive Study">
          <Input
            value={value.passive}
            placeholder="e.g. 3h"
            onChange={(e) => onChange({ passive: e.target.value })}
          />
        </Field>
        <Field label="Active Study">
          <Input
            value={value.active}
            placeholder="e.g. 30min"
            onChange={(e) => onChange({ active: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Annotations" className="mt-4">
        <Textarea
          value={value.annotations}
          placeholder="What did you study? Key takeaways..."
          rows={3}
          onChange={(e) => onChange({ annotations: e.target.value })}
        />
      </Field>

      <Field label="Observations (optional)" className="mt-4">
        <Textarea
          value={value.observations}
          placeholder="Anything else worth noting..."
          rows={2}
          onChange={(e) => onChange({ observations: e.target.value })}
        />
      </Field>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Minus, Plus, Save, RotateCcw } from 'lucide-react'
import { AREA_META, METRICS, scoreBand, type Area } from '@/lib/data'
import { computeScores, usePOS } from '@/lib/store'
import { ProgressRing } from '@/components/progress-ring'
import { SectionHeader } from '@/components/section-header'
import { cn } from '@/lib/utils'

const toneColor = {
  success: 'var(--success)',
  aoi: 'var(--aoi)',
  gold: 'var(--gold)',
  primary: 'var(--primary)',
} as const

function Stepper({ id }: { id: string }) {
  const value = usePOS((s) => s.results[id] ?? 0)
  const setResult = usePOS((s) => s.setResult)
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setResult(id, value - 1)}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Decrease"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => setResult(id, Number(e.target.value))}
        className="h-8 w-12 rounded-md border border-border bg-background text-center font-mono text-sm tabular-nums outline-none focus:border-primary"
      />
      <button
        onClick={() => setResult(id, value + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Increase"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function Scorecard() {
  const results = usePOS((s) => s.results)
  const saveWeek = usePOS((s) => s.saveWeek)
  const resetWeek = usePOS((s) => s.resetWeek)
  const { byArea, final } = computeScores(results)
  const band = scoreBand(final)

  return (
    <section>
      <SectionHeader
        kanji="点"
        eyebrow="Weekly Scorecard"
        title="Track outputs, not intentions"
        description="Log what you actually shipped this week. Your score updates live using the 40 / 40 / 20 success formula."
      />

      {/* Summary */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 rounded-2xl border border-border bg-card p-6"
        >
          <ProgressRing
            value={final}
            size={132}
            stroke={9}
            color={toneColor[band.tone]}
            label={`${final}%`}
            sublabel="Final"
          />
          <div>
            <p
              className="font-jp-serif text-2xl font-bold"
              style={{ color: toneColor[band.tone] }}
            >
              {band.label}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Target: <span className="font-mono text-foreground">85%+</span> for 8 consecutive weeks.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={saveWeek}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Save className="h-4 w-4" /> Save week
              </button>
              <button
                onClick={resetWeek}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(byArea) as Area[]).map((area, i) => (
            <motion.div
              key={area}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 text-center"
            >
              <ProgressRing
                value={byArea[area]}
                size={84}
                stroke={7}
                color={AREA_META[area].color}
                label={`${byArea[area]}`}
              />
              <p className="mt-2 font-jp-serif text-sm" style={{ color: AREA_META[area].color }}>
                {AREA_META[area].kanji}
              </p>
              <p className="text-xs text-muted-foreground">
                {AREA_META[area].label} · {Math.round(AREA_META[area].weight * 100)}%
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metric table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Area</span>
          <span className="text-right">Target</span>
          <span className="text-right">Result</span>
        </div>
        {METRICS.map((m, i) => {
          const r = results[m.id] ?? 0
          const pct = Math.min(r / m.target, 1)
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border/60 px-5 py-3 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-background font-jp-serif text-base"
                  style={{ color: AREA_META[m.area].color }}
                >
                  {m.kanji}
                </span>
                <div>
                  <p className="text-sm font-medium leading-tight">{m.label}</p>
                  <div className="mt-1.5 h-1 w-28 overflow-hidden rounded-full bg-background">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: AREA_META[m.area].color }}
                      animate={{ width: `${pct * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <span className="text-right font-mono text-sm tabular-nums text-muted-foreground">
                {m.target}
                <span className="ml-1 text-xs">{m.unit}</span>
              </span>
              <div className="flex justify-end">
                <Stepper id={m.id} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Formula */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-secondary/30 p-6">
          <p className="font-jp-serif text-sm text-primary">公式 · Success Formula</p>
          <div className="mt-3 space-y-1 font-mono text-sm text-muted-foreground">
            <p>Japanese · <span className="text-foreground">40%</span></p>
            <p>Programming · <span className="text-foreground">40%</span></p>
            <p>University · <span className="text-foreground">20%</span></p>
          </div>
          <p className="mt-4 font-mono text-sm">
            ({byArea.japanese}×0.4) + ({byArea.programming}×0.4) + ({byArea.university}×0.2) ={' '}
            <span className="font-semibold text-primary">{final}%</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { range: '90—100%', label: 'Excellent', tone: 'success' as const },
            { range: '80—89%', label: 'Good', tone: 'aoi' as const },
            { range: '70—79%', label: 'Acceptable', tone: 'gold' as const },
            { range: 'Below 70%', label: 'Fix the system', tone: 'primary' as const },
          ].map((b) => (
            <div
              key={b.label}
              className={cn(
                'flex flex-col justify-center rounded-xl border bg-card p-4',
                band.label === b.label ? 'border-primary/50' : 'border-border',
              )}
            >
              <span className="font-mono text-sm" style={{ color: toneColor[b.tone] }}>
                {b.range}
              </span>
              <span className="text-sm text-muted-foreground">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

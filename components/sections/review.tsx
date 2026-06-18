'use client'

import { motion } from 'framer-motion'
import { Check, X, Trash2 } from 'lucide-react'
import {
  Area,
  AREA_META,
  ANTI_DISTRACTION,
  REVIEW_QUESTIONS,
  scoreBand,
} from '@/lib/data'
import { usePOS } from '@/lib/store'
import { SectionHeader } from '@/components/section-header'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const toneColor = {
  success: 'var(--success)',
  aoi: 'var(--aoi)',
  gold: 'var(--gold)',
  primary: 'var(--primary)',
} as const

export function Review() {
  const history = usePOS((s) => s.history)
  const reviewNotes = usePOS((s) => s.reviewNotes)
  const setNote = usePOS((s) => s.setNote)
  const clearHistory = usePOS((s) => s.clearHistory)

  const chartData = [...history]
    .reverse()
    .map((h, i) => ({
      name: `W${i + 1}`,
      score: h.final,
    }))

  return (
    <section>
      <SectionHeader
        kanji="省"
        eyebrow="Weekly Review · Anti-Distraction"
        title="Reflect, recalibrate, repeat"
        description="The highest-leverage habit. Thirty minutes every Sunday to keep the system from drifting."
      />

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-jp-serif text-lg font-bold">記録 · Score History</p>
            <p className="text-sm text-muted-foreground">
              Goal: 85%+ for 8 consecutive weeks
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border text-center">
            <span className="font-jp-serif text-4xl text-foreground/10">空</span>
            <p className="mt-2 text-sm text-muted-foreground">
              No weeks saved yet. Log results in the Scorecard and hit Save week.
            </p>
          </div>
        ) : (
          <>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <ReferenceLine y={85} stroke="var(--gold)" strokeDasharray="4 4" />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--popover)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      color: 'var(--foreground)',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: 'var(--primary)' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {history.map((h) => {
                const band = scoreBand(h.final)
                return (
                  <div
                    key={h.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-1.5"
                  >
                    <span className="font-mono text-sm font-semibold" style={{ color: toneColor[band.tone] }}>
                      {h.final}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </motion.div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Review questions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <p className="font-jp-serif text-lg font-bold text-primary">振り返り · Weekly Review</p>
          <p className="mb-4 text-sm text-muted-foreground">Answer honestly every Sunday.</p>
          <div className="space-y-4">
            {REVIEW_QUESTIONS.map((q, i) => (
              <div key={q}>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border font-mono text-[10px] text-primary">
                    {i + 1}
                  </span>
                  {q}
                </label>
                <textarea
                  value={reviewNotes[`q${i}`] ?? ''}
                  onChange={(e) => setNote(`q${i}`, e.target.value)}
                  rows={2}
                  placeholder="..."
                  className="mt-2 w-full resize-none rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Anti distraction */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
            <p className="font-jp-serif text-sm" style={{ color: 'var(--success)' }}>
              集中 · Only track
            </p>
            <ul className="mt-3 space-y-2">
              {ANTI_DISTRACTION.track.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4" style={{ color: 'var(--success)' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <p className="font-jp-serif text-sm text-destructive">無視 · Ignore</p>
            <ul className="mt-3 space-y-2">
              {ANTI_DISTRACTION.ignore.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/30 p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              For the next 8 weeks, your entire life is{' '}
              {(Object.keys(AREA_META) as Area[]).map((a, i) => (
                <span key={a}>
                  <span className="font-medium text-foreground">{AREA_META[a].label}</span>
                  {i < 2 ? ', ' : '.'}
                </span>
              ))}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

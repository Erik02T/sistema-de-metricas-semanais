'use client'

import { motion } from 'framer-motion'
import { BookOpen, Code2, Languages, NotebookPen, ArrowRight } from 'lucide-react'
import { useOS } from '@/lib/store'
import { AREAS, AREA_MAP } from '@/lib/data'
import { DAYS, type AreaId } from '@/lib/types'
import { durationToMinutes, formatMinutes, formatRange, weekNumber } from '@/lib/week'
import { FujiMotif } from '@/components/fuji-motif'
import { Card } from '@/components/ui/primitives'
import type { SectionId } from '@/components/sidebar'

export function Dashboard({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const activeWeek = useOS((s) => s.activeWeek)
  const metrics = useOS((s) => s.metrics)
  const chunks = useOS((s) => s.chunks)
  const kanji = useOS((s) => s.kanji)
  const vocab = useOS((s) => s.vocab)
  const issues = useOS((s) => s.issues)
  const activities = useOS((s) => s.activities)

  const week = metrics[activeWeek] ?? {}

  // Minutes per area + total
  const perArea: { area: AreaId; min: number }[] = AREAS.map((a) => {
    const areaData = week[a.id] ?? {}
    const min = DAYS.reduce(
      (acc, d) =>
        acc + durationToMinutes(areaData[d]?.passive ?? '') + durationToMinutes(areaData[d]?.active ?? ''),
      0,
    )
    return { area: a.id, min }
  })
  const totalMin = perArea.reduce((acc, p) => acc + p.min, 0)
  const maxMin = Math.max(1, ...perArea.map((p) => p.min))

  const openIssues = issues.filter((i) => i.status !== 'done').length
  const doneIssues = issues.filter((i) => i.status === 'done').length
  const progress = issues.length ? Math.round((doneIssues / issues.length) * 100) : 0

  // Latest annotations across areas for this week
  const latest: { area: AreaId; day: string; text: string }[] = []
  for (const a of AREAS) {
    const areaData = week[a.id] ?? {}
    for (const d of DAYS) {
      const note = areaData[d]?.annotations?.trim()
      if (note) latest.push({ area: a.id, day: d, text: note })
    }
  }
  const recentNotes = latest.slice(-4).reverse()

  // Upcoming activities (not done/cancelled), ordered by day then start
  const upcoming = [...activities]
    .filter((a) => a.status === 'planned' || a.status === 'in-progress')
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.start.localeCompare(b.start))
    .slice(0, 5)

  const stats = [
    { label: 'Chunks', value: chunks.length, kanji: '塊', icon: BookOpen, to: 'japanese' as SectionId },
    { label: 'Kanji', value: kanji.length, kanji: '漢', icon: Languages, to: 'japanese' as SectionId },
    { label: 'Vocabulary', value: vocab.length, kanji: '語', icon: Languages, to: 'japanese' as SectionId },
    { label: 'Open Issues', value: openIssues, kanji: '課', icon: Code2, to: 'programming' as SectionId },
  ]

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 backdrop-blur-sm sm:p-8">
        <div className="relative z-10 max-w-md">
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary">
            Week {weekNumber(activeWeek)} · {formatRange(activeWeek)}
          </p>
          <h1 className="mt-2 text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Your evolution, in one place
          </h1>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Record knowledge, track progress, review every week.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <div>
              <p className="font-mono text-3xl font-semibold tabular-nums">{formatMinutes(totalMin)}</p>
              <p className="text-xs text-muted-foreground">Studied this week</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <p className="font-mono text-3xl font-semibold tabular-nums">{progress}%</p>
              <p className="text-xs text-muted-foreground">Issues completed</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-6 bottom-0 w-48 opacity-90 sm:w-64">
          <FujiMotif />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.button
              key={s.label}
              onClick={() => onNavigate(s.to)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card/80 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-jp-serif text-primary">
                  {s.kanji}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold tabular-nums">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* Hours per area */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">Hours per area</h3>
            <button
              onClick={() => onNavigate('metrics')}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Log <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {perArea.map((p) => {
              const meta = AREA_MAP[p.area]
              return (
                <div key={p.area} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs text-muted-foreground">{meta.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: meta.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(p.min / maxMin) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right font-mono text-xs text-muted-foreground">
                    {formatMinutes(p.min)}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Upcoming activities */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">Next activities</h3>
            <button
              onClick={() => onNavigate('schedule')}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Plan <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <EmptyHint text="No planned activities yet. Build your weekly schedule." />
          ) : (
            <div className="flex flex-col gap-2">
              {upcoming.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/40 px-3 py-2"
                >
                  <span className="h-8 w-1 rounded-full" style={{ background: a.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.day} · {a.start}–{a.end}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Latest annotations */}
      <Card className="mt-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-base font-semibold">Latest annotations</h3>
          <NotebookPen className="h-4 w-4 text-muted-foreground" strokeWidth={1.6} />
        </div>
        {recentNotes.length === 0 ? (
          <EmptyHint text="No annotations yet this week. Head to Weekly Metrics to record what you learned." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentNotes.map((n, i) => (
              <div key={i} className="rounded-xl border border-border bg-background/40 p-3">
                <p className="mb-1 text-[11px] uppercase tracking-wide text-primary">
                  {AREA_MAP[n.area].label} · {n.day}
                </p>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{n.text}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function EmptyHint({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{text}</p>
}

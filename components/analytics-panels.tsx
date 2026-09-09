'use client'

import { useMemo, useState } from 'react'
import { Check, Clock3, Flame, Gauge, Target, TrendingUp } from 'lucide-react'
import { buildReviewPrompt, buildWeeklyAnalytics, getWeekIds } from '@/lib/domain/analytics'
import { useAdaptiveOS } from '@/lib/domain/store'
import { currentContextKey } from '@/lib/dates'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

function scoreTone(score: number) {
  return score >= 85 ? 'text-success' : score >= 65 ? 'text-gold' : 'text-primary'
}

export function ScorecardPanel() {
  const state = useAdaptiveOS()
  const weekId = currentContextKey().weekId
  const analytics = useMemo(() => buildWeeklyAnalytics(weekId, state.tasks, state.blocks, state.weeklyGoals), [weekId, state.tasks, state.blocks, state.weeklyGoals])
  return <><PageIntro eyebrow="Evidence over intention" title="Scorecard" description="Measure outcomes, execution and consistency together — not hours in isolation." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Metric icon={Target} label="Overall" value={`${analytics.overallScore}%`} tone={scoreTone(analytics.overallScore)} detail={`${analytics.completedGoals}/${analytics.totalGoals || '—'} goals complete`} /><Metric icon={Check} label="Outcomes" value={`${analytics.outcomeScore}%`} tone={scoreTone(analytics.outcomeScore)} detail={`${analytics.completedTasks} completed actions`} /><Metric icon={Clock3} label="Execution" value={`${analytics.actualMinutes}m`} tone="text-sakura" detail={`${analytics.completedBlocks} completed blocks`} /><Metric icon={Flame} label="Consistency" value={`${analytics.activeDays} days`} tone="text-primary" detail={`${analytics.averageBlockMinutes || 0}m average block`} /></div><Card className="mt-6"><CardHeader><CardDescription>Weekly readout</CardDescription><CardTitle className="text-xl">{analytics.message}</CardTitle></CardHeader><CardContent><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${analytics.overallScore}%` }} /></div><div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground"><Badge variant="outline">Planned {analytics.plannedMinutes}m</Badge><Badge variant="outline">Actual {analytics.actualMinutes}m</Badge><Badge variant="outline">Best day {analytics.bestDay || 'not yet'}</Badge></div></CardContent></Card></>
}

export function HistoryPanel() {
  const state = useAdaptiveOS()
  const currentWeek = currentContextKey().weekId
  const weeks = getWeekIds(currentWeek)
  return <><PageIntro eyebrow="Patterns over time" title="History" description="Use your recorded blocks to see which capacity and rhythms create progress." /><div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{weeks.map((weekId) => { const analytics = buildWeeklyAnalytics(weekId, state.tasks, state.blocks, state.weeklyGoals); return <Card key={weekId}><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-base">{weekId}</CardTitle><Badge variant="outline" className={scoreTone(analytics.overallScore)}>{analytics.overallScore}%</Badge></div><CardDescription>{analytics.activeDays ? `${analytics.activeDays} active days · ${analytics.actualMinutes} minutes` : 'No execution recorded yet.'}</CardDescription></CardHeader><CardContent><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${analytics.overallScore}%` }} /></div><p className="mt-3 text-xs text-muted-foreground">{analytics.completedBlocks} blocks · {analytics.completedTasks} actions · {analytics.completedGoals} goals</p></CardContent></Card> })}</div></>
}

export function ReviewPanel() {
  const state = useAdaptiveOS()
  const weekId = currentContextKey().weekId
  const analytics = useMemo(() => buildWeeklyAnalytics(weekId, state.tasks, state.blocks, state.weeklyGoals), [weekId, state.tasks, state.blocks, state.weeklyGoals])
  const prompt = useMemo(() => buildReviewPrompt(analytics, state.weeklyGoals.filter((goal) => goal.weekId === weekId), state.tasks), [analytics, state.weeklyGoals, state.tasks, weekId])
  const existing = state.reviews[weekId]
  const [wins, setWins] = useState(existing?.wins || prompt.wins.join('\n'))
  const [lessons, setLessons] = useState(existing?.lessons || '')
  const [decision, setDecision] = useState(existing?.nextWeekDecision || '')
  return <><PageIntro eyebrow="Close the loop" title="Weekly Review" description="Turn what actually happened into one better decision for next week." /><div className="grid gap-4 lg:grid-cols-3"><Card><CardHeader><CardDescription>This week</CardDescription><CardTitle className="text-3xl">{analytics.overallScore}%</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{prompt.prompt}</p></CardContent></Card><Card className="lg:col-span-2"><CardHeader><CardTitle className="text-lg">Reflection</CardTitle><CardDescription>Keep the review concrete. Name evidence, not vague feelings.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm">Wins<Textarea value={wins} onChange={(event) => setWins(event.target.value)} placeholder="What moved forward?" /></label><label className="flex flex-col gap-2 text-sm">Lessons and friction<Textarea value={lessons} onChange={(event) => setLessons(event.target.value)} placeholder="What made progress easier or harder?" /></label><label className="flex flex-col gap-2 text-sm">Next week decision<Textarea value={decision} onChange={(event) => setDecision(event.target.value)} placeholder={prompt.prompt} /></label><Button onClick={() => state.setReview({ weekId, wins, failures: '', unfinished: prompt.unfinished.join('\n'), distractions: '', lessons, nextWeekDecision: decision, updatedAt: new Date().toISOString() })}>Save review</Button></CardContent></Card></div></>
}

function Metric({ icon: Icon, label, value, detail, tone }: { icon: typeof Target; label: string; value: string; detail: string; tone: string }) { return <Card><CardHeader><div className="flex items-center justify-between"><CardDescription>{label}</CardDescription><Icon className="size-4 text-muted-foreground" /></div><CardTitle className={`text-3xl ${tone}`}>{value}</CardTitle></CardHeader><CardContent><p className="text-xs text-muted-foreground">{detail}</p></CardContent></Card> }
function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="mb-8"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p><h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{description}</p></div> }

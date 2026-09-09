'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check, Plus, Target } from 'lucide-react'
import { useAdaptiveOS } from '@/lib/domain/store'
import { calculateGoalsHealth } from '@/lib/domain/planning'
import { currentContextKey } from '@/lib/dates'
import type { AreaId, WeeklyGoal } from '@/lib/domain/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ActionsBoard } from '@/components/actions-board'

const areas: { id: AreaId; label: string }[] = [
  { id: 'japanese', label: 'Japanese' },
  { id: 'programming', label: 'Programming' },
  { id: 'university', label: 'University' },
]
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function AdaptiveNext({ onBack }: { onBack: () => void }) {
  const state = useAdaptiveOS()
  const weekId = currentContextKey().weekId
  const [title, setTitle] = useState('')
  const [objectiveId, setObjectiveId] = useState(state.objectives[0]?.id || '')
  const [target, setTarget] = useState('120')
  const goals = state.weeklyGoals.filter((goal) => goal.weekId === weekId)
  const health = useMemo(() => calculateGoalsHealth(state.weeklyGoals, state.tasks, state.objectives, weekId), [state.weeklyGoals, state.tasks, state.objectives, weekId])

  function addGoal() {
    if (!title.trim() || !objectiveId) return
    const goal: WeeklyGoal = { id: uid(), objectiveId, weekId, title: title.trim(), desiredOutcome: title.trim(), minimumOutcome: `Minimum version of ${title.trim()}`, targetMinutes: Number(target) || 60, actualMinutes: 0, progress: 0, priority: goals.length + 1, status: 'active' }
    state.addWeeklyGoal(goal)
    setTitle('')
  }

  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 px-5 py-4 backdrop-blur-xl"><div className="mx-auto flex max-w-6xl items-center justify-between"><button onClick={onBack} className="font-heading text-sm font-semibold tracking-[0.18em]">KESSHŌ <span className="text-primary">/</span> Adaptive OS</button><Badge variant="outline">{weekId}</Badge></div></header>
    <main className="mx-auto max-w-6xl px-5 py-8 lg:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Weekly direction</p><h1 className="font-heading text-3xl font-bold sm:text-4xl">Make the week concrete.</h1><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Choose outcomes that matter, then let Today adapt around the capacity you actually have.</p></div><Button onClick={onBack}>Back to dashboard <ArrowRight data-icon="inline-end" /></Button></div>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="size-5 text-primary" />Add a weekly outcome</CardTitle><CardDescription>One clear result is better than a long list of intentions.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3"><Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What must move forward this week?" onKeyDown={(event) => event.key === 'Enter' && addGoal()} /><div className="flex flex-col gap-3 sm:flex-row"><select value={objectiveId} onChange={(event) => setObjectiveId(event.target.value)} className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm">{state.objectives.map((objective) => <option key={objective.id} value={objective.id}>{objective.title}</option>)}</select><Input className="sm:w-32" type="number" min="15" value={target} onChange={(event) => setTarget(event.target.value)} aria-label="Target minutes" /><Button onClick={addGoal}><Plus data-icon="inline-start" />Add goal</Button></div></CardContent></Card>
        <Card><CardHeader><CardDescription>Week health</CardDescription><CardTitle className="flex items-center gap-2 text-3xl">{health.progress}% <Badge variant="outline">{health.label}</Badge></CardTitle></CardHeader><CardContent><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${health.progress}%` }} /></div><p className="mt-3 text-sm text-muted-foreground">{health.message}</p><p className="mt-3 text-xs text-muted-foreground">{health.completedGoals} of {health.totalGoals} outcomes complete · {health.actualMinutes}/{health.plannedMinutes} minutes</p></CardContent></Card>
      </div>
      <section className="mt-8"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-heading text-xl font-semibold">This week&apos;s outcomes</h2><p className="mt-1 text-sm text-muted-foreground">Update progress as evidence appears.</p></div><Badge variant="outline">{goals.length} goals</Badge></div><div className="grid gap-3 md:grid-cols-2">{goals.length ? goals.map((goal) => { const objective = state.objectives.find((item) => item.id === goal.objectiveId); return <Card key={goal.id}><CardContent className="flex flex-col gap-4 py-5"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{goal.title}</p><p className="mt-1 text-xs text-muted-foreground">{objective?.title || 'Unlinked objective'} · {goal.targetMinutes} min target</p></div><Badge variant={goal.status === 'completed' ? 'default' : 'outline'}>{goal.status}</Badge></div><div><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>{goal.progress}% progress</span><span>{goal.actualMinutes} min logged</span></div><input className="w-full accent-[var(--primary)]" type="range" min="0" max="100" value={goal.progress} onChange={(event) => { const progress = Number(event.target.value); state.updateWeeklyGoal(goal.id, { progress, actualMinutes: Math.round(goal.targetMinutes * progress / 100), status: progress >= 100 ? 'completed' : progress > 0 ? 'active' : 'planned' }) }} /></div><Button variant="outline" size="sm" onClick={() => state.updateWeeklyGoal(goal.id, { progress: 100, actualMinutes: goal.targetMinutes, status: 'completed' })}><Check data-icon="inline-start" />Mark complete</Button></CardContent></Card> }) : <Card className="md:col-span-2"><CardContent className="py-12 text-center text-muted-foreground">No weekly outcomes yet. Add one above to make progress visible.</CardContent></Card>}</div></section>
      <section className="mt-10"><h2 className="mb-4 font-heading text-xl font-semibold">Actions and next steps</h2><ActionsBoard /></section>
      <section className="mt-10"><h2 className="mb-4 font-heading text-xl font-semibold">Objectives at a glance</h2><div className="grid gap-3 md:grid-cols-3">{areas.map((area) => { const count = state.objectives.filter((objective) => objective.areaId === area.id && objective.status === 'active').length; return <Card key={area.id}><CardContent className="flex items-center justify-between py-5"><div><p className="text-sm font-medium">{area.label}</p><p className="mt-1 text-xs text-muted-foreground">{count} active objective{count === 1 ? '' : 's'}</p></div><span className="size-3 rounded-full bg-primary" /></CardContent></Card> })}</div></section>
    </main>
  </div>
}

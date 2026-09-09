'use client'

import { useMemo, useState } from 'react'
import { Check, Plus, Search, Zap } from 'lucide-react'
import { useAdaptiveOS } from '@/lib/domain/store'
import { createCapturedTask } from '@/lib/domain/capture'
import type { AreaId, TaskStatus } from '@/lib/domain/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const STATUSES: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'todo', label: 'Todo' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'completed', label: 'Completed' },
]

export function ActionsBoard() {
  const state = useAdaptiveOS()
  const [capture, setCapture] = useState('')
  const [area, setArea] = useState<AreaId>('programming')
  const [objectiveId, setObjectiveId] = useState('')
  const [weeklyGoalId, setWeeklyGoalId] = useState('')
  const [query, setQuery] = useState('')
  const visible = useMemo(() => state.tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())), [state.tasks, query])

  function addTask() {
    if (!capture.trim()) return
    const task = createCapturedTask(capture, objectiveId || undefined, weeklyGoalId || undefined)
    state.addTask({ ...task, areaId: area })
    setCapture('')
  }

  return <div className="flex flex-col gap-6">
    <Card className="border-primary/30 bg-primary/[0.04]">
      <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="size-5 text-primary" />Quick capture</CardTitle><CardDescription>Write naturally. Duration, urgency and area are inferred before saving.</CardDescription></CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Textarea value={capture} onChange={(event) => setCapture(event.target.value)} placeholder="Example: Solve one binary tree problem for 25 min" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); addTask() } }} />
        <div className="flex flex-wrap gap-2"><select value={area} onChange={(event) => setArea(event.target.value as AreaId)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">{['programming', 'japanese', 'university'].map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={objectiveId} onChange={(event) => setObjectiveId(event.target.value)} className="h-9 max-w-56 rounded-md border border-input bg-background px-3 text-sm"><option value="">No objective</option>{state.objectives.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><select value={weeklyGoalId} onChange={(event) => setWeeklyGoalId(event.target.value)} className="h-9 max-w-56 rounded-md border border-input bg-background px-3 text-sm"><option value="">No weekly goal</option>{state.weeklyGoals.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><Button onClick={addTask}><Plus data-icon="inline-start" />Add action</Button></div>
      </CardContent>
    </Card>
    <div className="flex items-center gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search actions" /></div><Badge variant="outline">{visible.length} actions</Badge></div>
    <div className="grid gap-4 xl:grid-cols-5">{STATUSES.map((status) => <Card key={status.id} className="min-h-48"><CardHeader className="pb-3"><CardTitle className="text-sm">{status.label}</CardTitle><CardDescription>{visible.filter((task) => task.status === status.id).length} items</CardDescription></CardHeader><CardContent className="flex flex-col gap-2">{visible.filter((task) => task.status === status.id).map((task) => <div key={task.id} className="rounded-lg border border-border bg-background/70 p-3"><div className="flex items-start justify-between gap-2"><p className="text-sm font-medium">{task.title}</p>{task.status === 'completed' && <Check className="size-4 text-success" />}</div><div className="mt-2 flex flex-wrap gap-1"><Badge variant="outline" className="text-[10px]">{task.areaId}</Badge><Badge variant="outline" className="text-[10px]">{task.estimatedMinutes} min</Badge></div><div className="mt-3 flex gap-1">{status.id !== 'completed' && <Button size="sm" variant="outline" onClick={() => state.updateTask(task.id, { status: status.id === 'backlog' ? 'todo' : status.id === 'todo' ? 'in-progress' : 'completed', completedAt: status.id === 'in-progress' ? new Date().toISOString() : task.completedAt })}>{status.id === 'in-progress' ? 'Complete' : 'Advance'}</Button>}</div></div>)}</CardContent></Card>)}</div>
  </div>
}

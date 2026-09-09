'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, Pause, Play, RotateCcw, Sparkles, Square } from 'lucide-react'
import { useAdaptiveOS, defaultDailyContext } from '@/lib/domain/store'
import { getRecommendedTasks } from '@/lib/domain/planning'
import { currentContextKey } from '@/lib/dates'
import type { DailyContext, EnergyLevel } from '@/lib/domain/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
const energyLevels: EnergyLevel[] = ['low', 'medium', 'high']

export function FocusWorkspace() {
  const state = useAdaptiveOS()
  const fallback = useMemo(() => defaultDailyContext(), [])
  const [context, setContext] = useState<DailyContext>(fallback)
  const [elapsed, setElapsed] = useState(0)
  const [result, setResult] = useState('')
  const [energyAfter, setEnergyAfter] = useState<EnergyLevel>('medium')
  const contextKey = currentContextKey(context.timezone)
  const recommendations = useMemo(() => getRecommendedTasks(state.tasks, context), [state.tasks, context])
  const activeBlock = state.blocks.find((block) => block.date === context.date && block.status === 'active')
  const activeTask = activeBlock ? state.tasks.find((task) => task.id === activeBlock.taskId) : undefined
  const top = activeTask ? { task: activeTask } : recommendations[0]

  useEffect(() => {
    const saved = state.contexts[contextKey.date]
    if (saved) setContext(saved)
  }, [contextKey.date, state.contexts])

  useEffect(() => {
    if (!activeBlock) return
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - new Date(activeBlock.createdAt).getTime()) / 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [activeBlock])

  function updateContext(patch: Partial<DailyContext>) {
    const next = { ...context, ...patch }
    setContext(next)
    state.setContext(next)
  }

  function start() {
    if (!top) return
    const block = { id: uid(), date: context.date, taskId: top.task.id, plannedMinutes: Math.min(top.task.estimatedMinutes, context.availableMinutes), actualMinutes: 0, energyBefore: context.energy, status: 'active' as const, result: '', createdAt: new Date().toISOString() }
    state.addBlock(block)
    state.updateTask(top.task.id, { status: 'in-progress' })
    setElapsed(0)
  }

  function finish(status: 'completed' | 'cancelled') {
    if (!activeBlock) return
    const actualMinutes = Math.max(1, Math.round(elapsed / 60))
    state.updateBlock(activeBlock.id, { status, actualMinutes, energyAfter, result: result.trim() })
    if (activeTask) state.updateTask(activeTask.id, status === 'completed' ? { status: 'completed', completedAt: new Date().toISOString(), evidence: result.trim() } : { status: 'todo' })
    setResult('')
    setElapsed(0)
  }

  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0')
  const seconds = (elapsed % 60).toString().padStart(2, '0')

  return <div className="flex flex-col gap-6">
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader><CardTitle className="text-lg">Today&apos;s context</CardTitle><CardDescription>Set the conditions before choosing the next action.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm">Available minutes<Input type="number" min="5" value={context.availableMinutes} onChange={(event) => updateContext({ availableMinutes: Number(event.target.value) || 5 })} /></label>
          <label className="flex flex-col gap-2 text-sm">Focus window<Input type="number" min="5" value={context.focusMinutes} onChange={(event) => updateContext({ focusMinutes: Number(event.target.value) || 5 })} /></label>
          <div><p className="mb-2 text-sm">Energy available</p><div className="flex gap-2">{energyLevels.map((energy) => <Button key={energy} size="sm" variant={context.energy === energy ? 'default' : 'outline'} onClick={() => updateContext({ energy })}>{energy}</Button>)}</div></div>
          <Textarea value={context.commitments} onChange={(event) => updateContext({ commitments: event.target.value })} placeholder="Constraints or commitments today..." />
        </CardContent>
      </Card>
      <Card className="border-primary/30 bg-primary/[0.04]">
        <CardHeader><div className="flex items-center justify-between"><div><CardDescription>Next best action</CardDescription><CardTitle className="mt-1 text-2xl">{top?.task.title || 'No action fits yet'}</CardTitle></div><Sparkles className="size-5 text-primary" /></div></CardHeader>
        <CardContent><p className="text-sm leading-6 text-muted-foreground">{activeBlock ? 'This focus block is active. Protect the window and record what happened when you finish.' : top ? `Fits ${context.availableMinutes} minutes and ${context.energy} energy.` : 'Capture an action or increase your available minutes.'}</p><div className="mt-5 flex flex-wrap items-center gap-2"><Badge variant="outline">{top?.task.estimatedMinutes || 0} min</Badge><Badge variant="outline">{top?.task.energyRequired || '—'} energy</Badge>{!activeBlock && <Button onClick={start} disabled={!top}><Play data-icon="inline-start" />Start focus block</Button>}</div></CardContent>
      </Card>
    </div>
    {activeBlock && <Card className="border-primary/50"><CardContent className="flex flex-col gap-6 py-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><Badge>Active focus block</Badge><h2 className="mt-2 font-heading text-xl font-semibold">{activeTask?.title}</h2></div><div className="font-mono text-4xl font-semibold tracking-wider text-primary">{minutes}:{seconds}</div></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setElapsed((value) => Math.max(0, value - 60))}><Pause data-icon="inline-start" />Pause minute</Button><Button variant="outline" onClick={() => setElapsed(0)}><RotateCcw data-icon="inline-start" />Reset timer</Button></div><Textarea value={result} onChange={(event) => setResult(event.target.value)} placeholder="What concrete result will prove this block was useful?" /><div><p className="mb-2 text-sm">Energy after</p><div className="flex gap-2">{energyLevels.map((energy) => <Button key={energy} size="sm" variant={energyAfter === energy ? 'default' : 'outline'} onClick={() => setEnergyAfter(energy)}>{energy}</Button>)}</div></div><div className="flex flex-wrap gap-2"><Button onClick={() => finish('completed')}><Check data-icon="inline-start" />Complete block</Button><Button variant="outline" onClick={() => finish('cancelled')}><Square data-icon="inline-start" />Cancel block</Button></div></CardContent></Card>}
  </div>
}

'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAdaptiveOS } from '@/lib/domain/store'
import type { AreaId } from '@/lib/domain/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function QuickAdd() {
  const state = useAdaptiveOS()
  const [kind, setKind] = useState('task')
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState(30)
  function add() {
    if (!title.trim()) return
    const id = `${kind}-${Date.now()}`
    if (kind === 'objective') state.addObjective({ id, title: title.trim(), description: '', areaId: (state.areas[0]?.id || 'japanese') as AreaId, why: '', priority: state.objectives.length + 1, minimumOutcome: 'Make a small move.', targetOutcome: title.trim(), idealOutcome: 'Create compounding evidence.', minimumMinutes: 15, targetMinutes: minutes, idealMinutes: minutes * 2, status: 'active', createdAt: new Date().toISOString() })
    else if (kind === 'goal') state.addWeeklyGoal({ id, objectiveId: state.objectives[0]?.id || '', weekId: new Date().toISOString().slice(0, 4) + '-W01', title: title.trim(), desiredOutcome: title.trim(), minimumOutcome: 'Make a minimum move.', targetMinutes: minutes, actualMinutes: 0, progress: 0, priority: 1, status: 'planned' })
    else state.addTask({ id, title: title.trim(), description: '', areaId: (state.areas[0]?.id || 'japanese') as AreaId, status: 'todo', priority: 1, estimatedMinutes: minutes, minimumMinutes: Math.min(15, minutes), energyRequired: 'medium', nextAction: 'Define the first concrete step.', createdAt: new Date().toISOString() })
    setTitle('')
  }
  return <Card className="mb-6"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" />Quick Add</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 sm:flex-row"><select value={kind} onChange={(event) => setKind(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="task">Task</option><option value="objective">Objective</option><option value="goal">Weekly goal</option></select><Input value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) add() }} placeholder="Add something that matters" /><Input className="w-full sm:w-28" type="number" min={5} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} /><Button onClick={add}>Add</Button></CardContent></Card>
}

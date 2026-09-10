'use client'

import { useState } from 'react'
import { Activity, BookOpen, Check, X } from 'lucide-react'
import { useAdaptiveOS } from '@/lib/domain/store'
import type { AreaId, SessionKind } from '@/lib/domain/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function SessionsPanel() {
  const state = useAdaptiveOS()
  const [kind, setKind] = useState<SessionKind>('study')
  const [minutes, setMinutes] = useState(25)
  const [result, setResult] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = state.sessions.find((session) => session.id === activeId)
  function start() {
    const id = `session-${Date.now()}`
    state.addSession({ id, kind, areaId: (state.areas[0]?.id || 'japanese') as AreaId, startedAt: new Date().toISOString(), plannedMinutes: minutes, actualMinutes: 0, status: 'active', result: '', evidence: '' })
    setActiveId(id)
  }
  function finish(status: 'completed' | 'cancelled') {
    if (!active) return
    state.updateSession(active.id, { status, endedAt: new Date().toISOString(), actualMinutes: status === 'completed' ? minutes : 0, result, cancelReason: status === 'cancelled' ? result : undefined })
    setActiveId(null)
    setResult('')
  }
  return <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpen className="size-4" />Study / Activity Sessions</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">{active ? <div className="flex flex-col gap-3"><div className="rounded-lg bg-primary/10 p-4"><p className="font-medium">Session active · {active.kind}</p><p className="mt-1 text-sm text-muted-foreground">{active.plannedMinutes} minutes planned.</p></div><Input value={result} onChange={(event) => setResult(event.target.value)} placeholder="Result or cancellation reason" /><div className="flex flex-wrap gap-2"><Button onClick={() => finish('completed')}><Check data-icon="inline-start" />Complete</Button><Button variant="destructive" onClick={() => finish('cancelled')}><X data-icon="inline-start" />Cancel</Button></div></div> : <><div className="flex flex-wrap gap-2"><Button size="sm" variant={kind === 'study' ? 'default' : 'outline'} onClick={() => setKind('study')}><BookOpen data-icon="inline-start" />Study</Button><Button size="sm" variant={kind === 'activity' ? 'default' : 'outline'} onClick={() => setKind('activity')}><Activity data-icon="inline-start" />Activity</Button></div><div className="flex flex-col gap-3 sm:flex-row"><Input type="number" min={5} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} /><Button onClick={start}>Start session</Button></div></>}</CardContent></Card>
}

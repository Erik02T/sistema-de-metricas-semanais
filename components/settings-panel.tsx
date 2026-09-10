'use client'

import { useMemo, useRef, useState } from 'react'
import { Check, RotateCcw, Settings2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdaptiveOS } from '@/lib/domain/store'

export function SettingsPanel() {
  const state = useAdaptiveOS()
  const fileInput = useRef<HTMLInputElement>(null)
  const [saved, setSaved] = useState(false)
  const [timezone, setTimezone] = useState(state.preferences.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  const [focusDefault, setFocusDefault] = useState(state.preferences.focusDefaultMinutes)
  const [weekStartsMonday, setWeekStartsMonday] = useState(state.preferences.weekStartsMonday)
  const existingData = useMemo(() => state.objectives.length + state.weeklyGoals.length + state.tasks.length + state.blocks.length, [state])

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `kessho-backup-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function importData(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!parsed || !Array.isArray(parsed.objectives) || !Array.isArray(parsed.tasks)) throw new Error('Invalid backup')
        state.replaceState(parsed)
        setSaved(true)
        window.setTimeout(() => setSaved(false), 1800)
      } catch {
        window.alert('This file is not a valid KESSHŌ backup.')
      }
    }
    reader.readAsText(file)
  }

  function save() {
    state.setPreferences({ timezone, focusDefaultMinutes: Math.max(5, Math.min(180, focusDefault)), weekStartsMonday })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">System preferences</p>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Keep the operating system aligned with your real calendar, timezone and preferred focus rhythm.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Settings2 className="size-4 text-primary" />Planning preferences</CardTitle><CardDescription>These preferences shape recommendations, not your identity.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm">Timezone<select value={timezone} onChange={(event) => setTimezone(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option>{timezone}</option><option>UTC</option><option>America/Sao_Paulo</option><option>America/New_York</option><option>Europe/Lisbon</option><option>Asia/Tokyo</option></select></label>
            <label className="flex flex-col gap-2 text-sm">Default focus minutes<input type="number" min={5} max={180} value={focusDefault} onChange={(event) => setFocusDefault(Number(event.target.value))} className="h-10 rounded-md border border-input bg-background px-3 text-sm" /></label>
            <label className="flex items-center justify-between gap-4 text-sm"><span>Week starts on Monday</span><input type="checkbox" checked={weekStartsMonday} onChange={(event) => setWeekStartsMonday(event.target.checked)} /></label>
            <Button onClick={save}>{saved ? <><Check data-icon="inline-start" />Saved</> : 'Save preferences'}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Local data</CardTitle><CardDescription>Your current prototype remains offline-first while backend persistence is still a separate phase.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Records stored locally</span><Badge variant="outline">{existingData}</Badge></div><p className="text-sm leading-6 text-muted-foreground">Objectives, goals, actions, blocks and reviews are stored in this browser. The migration does not delete the legacy workspace.</p><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={exportData}>Export backup</Button><Button variant="outline" onClick={() => fileInput.current?.click()}>Import backup</Button><input ref={fileInput} type="file" accept="application/json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) importData(file); event.currentTarget.value = '' }} /><Button variant="outline" onClick={() => window.location.reload()}><RotateCcw data-icon="inline-start" />Reload local state</Button></div><Button variant="destructive" onClick={() => { if (window.confirm('Reset all local KESSHŌ data?')) state.resetState() }}>Reset local workspace</Button></CardContent>
        </Card>
      </div>
    </div>
  )
}

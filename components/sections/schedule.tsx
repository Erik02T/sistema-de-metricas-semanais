'use client'

import { useState } from 'react'
import { Plus, Pencil, Copy, Trash2, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOS } from '@/lib/store'
import { AREAS, AREA_MAP, DAY_KANJI, ACTIVITY_STATUS } from '@/lib/data'
import { DAYS, type Activity, type ActivityStatus, type AreaId, type Day } from '@/lib/types'
import { SectionHeader } from '@/components/section-header'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Field, Input, Select, Textarea } from '@/components/ui/primitives'

const PALETTE = [
  'var(--primary)',
  'var(--sakura)',
  'var(--sakura-soft)',
  'var(--foreground)',
  'oklch(0.45 0.12 18)',
  'oklch(0.66 0.2 30)',
  'oklch(0.72 0.11 12)',
]

type Draft = Omit<Activity, 'id'> & { id?: string }

function blankDraft(day: Day): Draft {
  return {
    title: '',
    area: 'japanese',
    color: AREA_MAP.japanese.color,
    start: '08:00',
    end: '09:00',
    day,
    description: '',
    status: 'planned',
  }
}

export function Schedule() {
  const activities = useOS((s) => s.activities)
  const addActivity = useOS((s) => s.addActivity)
  const updateActivity = useOS((s) => s.updateActivity)
  const removeActivity = useOS((s) => s.removeActivity)
  const duplicateActivity = useOS((s) => s.duplicateActivity)
  const moveActivity = (id: string, day: Day) => updateActivity(id, { day })

  const [draft, setDraft] = useState<Draft | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overDay, setOverDay] = useState<Day | null>(null)

  const openNew = (day: Day) => setDraft(blankDraft(day))
  const openEdit = (a: Activity) => setDraft({ ...a })

  const save = () => {
    if (!draft || !draft.title.trim()) return
    if (draft.id) {
      const { id, ...patch } = draft
      updateActivity(id, patch)
    } else {
      const { id: _omit, ...data } = draft
      addActivity(data)
    }
    setDraft(null)
  }

  return (
    <div>
      <SectionHeader
        kanji="予"
        eyebrow="Weekly Schedule"
        title="Plan your week"
        description="A fully editable planner. Drag activities between days, or duplicate, edit and track their status."
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {DAYS.map((day) => {
          const dayActs = activities
            .filter((a) => a.day === day)
            .sort((a, b) => a.start.localeCompare(b.start))
          return (
            <div
              key={day}
              onDragOver={(e) => {
                e.preventDefault()
                setOverDay(day)
              }}
              onDragLeave={() => setOverDay((d) => (d === day ? null : d))}
              onDrop={() => {
                if (dragId) moveActivity(dragId, day)
                setDragId(null)
                setOverDay(null)
              }}
              className={cn(
                'flex flex-col rounded-2xl border bg-card/60 p-3 backdrop-blur-sm transition-colors',
                overDay === day ? 'border-primary/60 bg-primary/5' : 'border-border',
              )}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="font-jp-serif text-primary">{DAY_KANJI[day]}</span>
                  <h3 className="text-sm font-semibold">{day}</h3>
                  <span className="text-xs text-muted-foreground">({dayActs.length})</span>
                </div>
                <button
                  onClick={() => openNew(day)}
                  className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={`Add activity on ${day}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {dayActs.length === 0 && (
                  <button
                    onClick={() => openNew(day)}
                    className="rounded-xl border border-dashed border-border py-6 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    + Add activity
                  </button>
                )}
                {dayActs.map((a) => (
                  <ActivityCard
                    key={a.id}
                    activity={a}
                    onDragStart={() => setDragId(a.id)}
                    onEdit={() => openEdit(a)}
                    onDuplicate={() => duplicateActivity(a.id)}
                    onRemove={() => removeActivity(a.id)}
                    onStatus={(status) => updateActivity(a.id, { status })}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <ActivityModal draft={draft} setDraft={setDraft} onSave={save} onClose={() => setDraft(null)} />
    </div>
  )
}

function ActivityCard({
  activity,
  onDragStart,
  onEdit,
  onDuplicate,
  onRemove,
  onStatus,
}: {
  activity: Activity
  onDragStart: () => void
  onEdit: () => void
  onDuplicate: () => void
  onRemove: () => void
  onStatus: (s: ActivityStatus) => void
}) {
  const status = ACTIVITY_STATUS.find((s) => s.id === activity.status)!
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        'group relative rounded-xl border border-border bg-background/60 p-3 transition-colors hover:border-primary/40',
        activity.status === 'done' && 'opacity-60',
        activity.status === 'cancelled' && 'opacity-40',
      )}
      style={{ borderLeft: `3px solid ${activity.color}` }}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground/50" />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate text-sm font-medium',
              activity.status === 'cancelled' && 'line-through',
            )}
          >
            {activity.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {activity.start}–{activity.end} · {AREA_MAP[activity.area].label}
          </p>
          {activity.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">
              {activity.description}
            </p>
          )}
          <select
            value={activity.status}
            onChange={(e) => onStatus(e.target.value as ActivityStatus)}
            className="mt-2 cursor-pointer rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-medium outline-none"
            style={{ color: status.tone }}
          >
            {ACTIVITY_STATUS.map((s) => (
              <option key={s.id} value={s.id} className="text-foreground">
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex shrink-0 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={onEdit} className="rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDuplicate} className="rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Duplicate">
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button onClick={onRemove} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ActivityModal({
  draft,
  setDraft,
  onSave,
  onClose,
}: {
  draft: Draft | null
  setDraft: (d: Draft | null) => void
  onSave: () => void
  onClose: () => void
}) {
  if (!draft) return null
  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch })

  return (
    <Modal
      open={!!draft}
      onClose={onClose}
      kanji="予"
      title={draft.id ? 'Edit activity' : 'New activity'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!draft.title.trim()}>
            {draft.id ? 'Save changes' : 'Add activity'}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <Field label="Title">
          <Input
            autoFocus
            value={draft.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="e.g. Japanese immersion"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Area">
            <Select
              value={draft.area}
              onChange={(e) => {
                const area = e.target.value as AreaId
                set({ area, color: AREA_MAP[area].color })
              }}
            >
              {AREAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Day">
            <Select value={draft.day} onChange={(e) => set({ day: e.target.value as Day })}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start">
            <Input type="time" value={draft.start} onChange={(e) => set({ start: e.target.value })} />
          </Field>
          <Field label="End">
            <Input type="time" value={draft.end} onChange={(e) => set({ end: e.target.value })} />
          </Field>
        </div>

        <Field label="Color">
          <div className="flex flex-wrap gap-2">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set({ color: c })}
                className={cn(
                  'h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110',
                  draft.color === c ? 'border-foreground' : 'border-transparent',
                )}
                style={{ background: c }}
                aria-label="Pick color"
              />
            ))}
          </div>
        </Field>

        <Field label="Status">
          <Select value={draft.status} onChange={(e) => set({ status: e.target.value as ActivityStatus })}>
            {ACTIVITY_STATUS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Description">
          <Textarea
            value={draft.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Details, goals, links..."
            rows={3}
          />
        </Field>
      </div>
    </Modal>
  )
}

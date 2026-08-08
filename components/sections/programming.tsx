'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Copy, Search, GripVertical, CalendarClock } from 'lucide-react'
import { useOS, uid } from '@/lib/store'
import { AREAS, AREA_MAP, ISSUE_COLUMNS, PRIORITIES } from '@/lib/data'
import type { Issue, IssueStatus, Priority, ChecklistItem, AreaId } from '@/lib/types'
import { SectionHeader } from '@/components/section-header'
import { Modal } from '@/components/ui/modal'
import { Field, Input, Textarea, Select, Badge, TagInput } from '@/components/ui/primitives'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function emptyIssue(): Issue {
  return {
    id: uid(),
    title: '',
    description: '',
    project: '',
    area: 'programming',
    priority: 'medium',
    status: 'backlog',
    createdAt: new Date().toISOString(),
    dueDate: '',
    checklist: [],
    notes: '',
    links: '',
    tags: [],
  }
}

export function Programming() {
  const issues = useOS((s) => s.issues)
  const addIssue = useOS((s) => s.addIssue)
  const updateIssue = useOS((s) => s.updateIssue)
  const removeIssue = useOS((s) => s.removeIssue)
  const duplicateIssue = useOS((s) => s.duplicateIssue)
  const moveIssue = useOS((s) => s.moveIssue)

  const [query, setQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [draft, setDraft] = useState<Issue | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<IssueStatus | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return issues.filter((i) => {
      if (priorityFilter !== 'all' && i.priority !== priorityFilter) return false
      if (!q) return true
      return [i.title, i.description, i.project, i.notes, i.tags.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [issues, query, priorityFilter])

  const byStatus = (status: IssueStatus) => filtered.filter((i) => i.status === status)

  function saveDraft() {
    if (!draft || !draft.title.trim()) return
    const exists = issues.some((i) => i.id === draft.id)
    if (exists) updateIssue(draft.id, draft)
    else addIssue(draft)
    setDraft(null)
  }

  return (
    <div>
      <SectionHeader
        kanji="工"
        eyebrow="Programming"
        title="Issue Board"
        description="Track what you build. Drag cards between columns to update their status."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search issues, projects, tags…"
            className="h-10 w-full rounded-lg border border-input bg-secondary/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
        <div className="w-40">
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
          >
            <option value="all">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={() => setDraft(emptyIssue())}>
          <Plus className="h-4 w-4" />
          New issue
        </Button>
      </div>

      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
        {ISSUE_COLUMNS.map((col) => {
          const cards = byStatus(col.id)
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault()
                setOverCol(col.id)
              }}
              onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
              onDrop={() => {
                if (dragId) moveIssue(dragId, col.id)
                setDragId(null)
                setOverCol(null)
              }}
              className={cn(
                'flex w-72 shrink-0 flex-col rounded-2xl border bg-card/50 transition-colors',
                overCol === col.id ? 'border-primary/60 bg-primary/5' : 'border-border',
              )}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-jp-serif text-primary">{col.kanji}</span>
                  <span className="text-sm font-semibold">{col.label}</span>
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {cards.length}
                </span>
              </div>

              <div className="flex min-h-24 flex-col gap-2 p-3">
                {cards.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onEdit={() => setDraft(issue)}
                    onDelete={() => removeIssue(issue.id)}
                    onDuplicate={() => duplicateIssue(issue.id)}
                    onDragStart={() => setDragId(issue.id)}
                    onDragEnd={() => {
                      setDragId(null)
                      setOverCol(null)
                    }}
                    dragging={dragId === issue.id}
                  />
                ))}
                {cards.length === 0 && (
                  <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                    Drop cards here
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {draft && (
        <IssueEditor
          draft={draft}
          setDraft={setDraft}
          onSave={saveDraft}
          onClose={() => setDraft(null)}
        />
      )}
    </div>
  )
}

function IssueCard({
  issue,
  onEdit,
  onDelete,
  onDuplicate,
  onDragStart,
  onDragEnd,
  dragging,
}: {
  issue: Issue
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onDragStart: () => void
  onDragEnd: () => void
  dragging: boolean
}) {
  const area = AREA_MAP[issue.area]
  const priority = PRIORITIES.find((p) => p.id === issue.priority)!
  const doneCount = issue.checklist.filter((c) => c.done).length

  return (
    <motion.div
      layout
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'group cursor-grab rounded-xl border border-border bg-card p-3 active:cursor-grabbing',
        dragging && 'opacity-40',
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: priority.color }}
            title={priority.label}
          />
          <p className="text-sm font-medium leading-snug text-balance">{issue.title}</p>
        </div>
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {issue.project && <p className="mb-2 text-xs text-muted-foreground">{issue.project}</p>}

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge style={{ color: area.color, borderColor: `${area.color}40` }}>
          {area.kanji} {area.label}
        </Badge>
        {issue.checklist.length > 0 && (
          <Badge>
            {doneCount}/{issue.checklist.length}
          </Badge>
        )}
        {issue.dueDate && (
          <Badge>
            <CalendarClock className="h-3 w-3" />
            {issue.dueDate}
          </Badge>
        )}
      </div>

      {issue.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {issue.tags.map((t) => (
            <span key={t} className="text-[10px] text-muted-foreground">
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Edit issue"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDuplicate}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Duplicate issue"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
          aria-label="Delete issue"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

function IssueEditor({
  draft,
  setDraft,
  onSave,
  onClose,
}: {
  draft: Issue
  setDraft: (i: Issue) => void
  onSave: () => void
  onClose: () => void
}) {
  const patch = (p: Partial<Issue>) => setDraft({ ...draft, ...p })

  function addChecklistItem() {
    patch({ checklist: [...draft.checklist, { id: uid(), text: '', done: false }] })
  }
  function updateItem(id: string, p: Partial<ChecklistItem>) {
    patch({ checklist: draft.checklist.map((c) => (c.id === id ? { ...c, ...p } : c)) })
  }
  function removeItem(id: string) {
    patch({ checklist: draft.checklist.filter((c) => c.id !== id) })
  }

  return (
    <Modal
      title={draft.title ? 'Edit issue' : 'New issue'}
      kanji="工"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!draft.title.trim()}>
            Save issue
          </Button>
        </>
      }
    >
      <Field label="Title" required>
        <Input
          value={draft.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Implement auth flow"
          autoFocus
        />
      </Field>

      <Field label="Description">
        <Textarea
          value={draft.description}
          onChange={(e) => patch({ description: e.target.value })}
          placeholder="What needs to be done and why"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Project">
          <Input
            value={draft.project}
            onChange={(e) => patch({ project: e.target.value })}
            placeholder="Portfolio v2"
          />
        </Field>
        <Field label="Area">
          <Select value={draft.area} onChange={(e) => patch({ area: e.target.value as AreaId })}>
            {AREAS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Priority">
          <Select
            value={draft.priority}
            onChange={(e) => patch({ priority: e.target.value as Priority })}
          >
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select
            value={draft.status}
            onChange={(e) => patch({ status: e.target.value as IssueStatus })}
          >
            {ISSUE_COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Due date">
          <Input
            type="date"
            value={draft.dueDate}
            onChange={(e) => patch({ dueDate: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Checklist">
        <div className="flex flex-col gap-2">
          {draft.checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateItem(item.id, { done: !item.done })}
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs',
                  item.done ? 'border-success bg-success/20 text-success' : 'border-input',
                )}
                aria-label="Toggle checklist item"
              >
                {item.done && '✓'}
              </button>
              <input
                value={item.text}
                onChange={(e) => updateItem(item.id, { text: e.target.value })}
                placeholder="Step…"
                className={cn(
                  'h-9 flex-1 rounded-md border border-input bg-secondary/40 px-2 text-sm outline-none focus:border-ring',
                  item.done && 'text-muted-foreground line-through',
                )}
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-destructive"
                aria-label="Remove checklist item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addChecklistItem}
            className="flex items-center gap-1.5 self-start rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            Add step
          </button>
        </div>
      </Field>

      <Field label="Notes">
        <Textarea
          value={draft.notes}
          onChange={(e) => patch({ notes: e.target.value })}
          placeholder="Implementation notes, gotchas, decisions"
        />
      </Field>

      <Field label="Links">
        <Input
          value={draft.links}
          onChange={(e) => patch({ links: e.target.value })}
          placeholder="https://github.com/…"
        />
      </Field>

      <Field label="Tags">
        <TagInput value={draft.tags} onChange={(tags) => patch({ tags })} />
      </Field>
    </Modal>
  )
}

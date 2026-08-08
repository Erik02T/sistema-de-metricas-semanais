'use client'

import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOS, uid } from '@/lib/store'
import { LEARN_STATUS, JLPT_LEVELS, CATEGORIES } from '@/lib/data'
import type { Chunk, KanjiEntry, LearnStatus, Pattern, VocabEntry, JLPT } from '@/lib/types'
import { SectionHeader } from '@/components/section-header'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge, Field, Input, Select, Textarea, TagInput } from '@/components/ui/primitives'

type Tab = 'chunks' | 'patterns' | 'kanji' | 'vocab'
const TABS: { id: Tab; label: string; kanji: string }[] = [
  { id: 'chunks', label: 'Chunks', kanji: '塊' },
  { id: 'patterns', label: 'Patterns', kanji: '型' },
  { id: 'kanji', label: 'Kanji', kanji: '漢' },
  { id: 'vocab', label: 'Vocabulary', kanji: '語' },
]

function StatusBadge({ status }: { status: LearnStatus }) {
  const s = LEARN_STATUS.find((x) => x.id === status)!
  return (
    <Badge color={s.color}>
      <span className="font-jp-serif">{s.kanji}</span> {s.label}
    </Badge>
  )
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function Japanese() {
  const [tab, setTab] = useState<Tab>('chunks')
  const [query, setQuery] = useState('')
  const store = useOS()

  const q = query.trim().toLowerCase()
  const searching = q.length > 0

  const filtered = useMemo(() => {
    const match = (obj: object) => JSON.stringify(obj).toLowerCase().includes(q)
    return {
      chunks: store.chunks.filter((c) => !searching || match(c)),
      patterns: store.patterns.filter((p) => !searching || match(p)),
      kanji: store.kanji.filter((k) => !searching || match(k)),
      vocab: store.vocab.filter((v) => !searching || match(v)),
    }
  }, [store.chunks, store.patterns, store.kanji, store.vocab, q, searching])

  const counts = {
    chunks: store.chunks.length,
    patterns: store.patterns.length,
    kanji: store.kanji.length,
    vocab: store.vocab.length,
  }

  const [editing, setEditing] = useState<
    | { type: 'chunk'; data: Chunk }
    | { type: 'pattern'; data: Pattern }
    | { type: 'kanji'; data: KanjiEntry }
    | { type: 'vocab'; data: VocabEntry }
    | null
  >(null)

  const newChunk = (): Chunk => ({
    id: uid(), title: '', expression: '', reading: '', romaji: '', portuguese: '', meaning: '',
    whenToUse: '', example: '', category: CATEGORIES[0], tags: [], jlpt: 'N5', frequency: '',
    learnedDate: today(), status: 'new',
  })
  const newPattern = (): Pattern => ({
    id: uid(), name: '', structure: '', explanation: '', examples: '', notes: '', links: '', tags: [],
  })
  const newKanji = (): KanjiEntry => ({
    id: uid(), kanji: '', on: '', kun: '', meaning: '', radical: '', jlpt: 'N5', frequency: '',
    relatedWords: '', sentences: '', notes: '', date: today(), status: 'new',
  })
  const newVocab = (): VocabEntry => ({
    id: uid(), word: '', reading: '', meaning: '', partOfSpeech: '', example: '', tags: [], jlpt: 'N5', status: 'new',
  })

  const addNew = () => {
    if (tab === 'chunks') setEditing({ type: 'chunk', data: newChunk() })
    if (tab === 'patterns') setEditing({ type: 'pattern', data: newPattern() })
    if (tab === 'kanji') setEditing({ type: 'kanji', data: newKanji() })
    if (tab === 'vocab') setEditing({ type: 'vocab', data: newVocab() })
  }

  return (
    <div>
      <SectionHeader
        kanji="語"
        eyebrow="Japanese"
        title="Knowledge base"
        description="Your second brain for Japanese: chunks, language patterns, kanji and vocabulary — all searchable."
      />

      {/* Global search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search everything: chunks, patterns, kanji, vocabulary..."
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      {!searching && (
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'border-primary/50 bg-primary/10 text-foreground'
                  : 'border-border bg-card/60 text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="font-jp-serif text-primary">{t.kanji}</span>
              {t.label}
              <span className="text-xs text-muted-foreground">{counts[t.id]}</span>
            </button>
          ))}
          <Button onClick={addNew} className="ml-auto shrink-0" size="sm">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="mt-5 space-y-6">
        {searching ? (
          <>
            <ResultGroup title="Chunks" count={filtered.chunks.length}>
              {filtered.chunks.map((c) => (
                <ChunkCard key={c.id} c={c} onEdit={() => setEditing({ type: 'chunk', data: c })} onDelete={() => store.removeChunk(c.id)} />
              ))}
            </ResultGroup>
            <ResultGroup title="Patterns" count={filtered.patterns.length}>
              {filtered.patterns.map((p) => (
                <PatternCard key={p.id} p={p} onEdit={() => setEditing({ type: 'pattern', data: p })} onDelete={() => store.removePattern(p.id)} />
              ))}
            </ResultGroup>
            <ResultGroup title="Kanji" count={filtered.kanji.length}>
              {filtered.kanji.map((k) => (
                <KanjiCard key={k.id} k={k} onEdit={() => setEditing({ type: 'kanji', data: k })} onDelete={() => store.removeKanji(k.id)} />
              ))}
            </ResultGroup>
            <ResultGroup title="Vocabulary" count={filtered.vocab.length}>
              {filtered.vocab.map((v) => (
                <VocabCard key={v.id} v={v} onEdit={() => setEditing({ type: 'vocab', data: v })} onDelete={() => store.removeVocab(v.id)} />
              ))}
            </ResultGroup>
            {filtered.chunks.length + filtered.patterns.length + filtered.kanji.length + filtered.vocab.length === 0 && (
              <p className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                No results for “{query}”.
              </p>
            )}
          </>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {tab === 'chunks' &&
              (filtered.chunks.length ? filtered.chunks.map((c) => (
                <ChunkCard key={c.id} c={c} onEdit={() => setEditing({ type: 'chunk', data: c })} onDelete={() => store.removeChunk(c.id)} />
              )) : <Empty label="chunks" />)}
            {tab === 'patterns' &&
              (filtered.patterns.length ? filtered.patterns.map((p) => (
                <PatternCard key={p.id} p={p} onEdit={() => setEditing({ type: 'pattern', data: p })} onDelete={() => store.removePattern(p.id)} />
              )) : <Empty label="patterns" />)}
            {tab === 'kanji' &&
              (filtered.kanji.length ? filtered.kanji.map((k) => (
                <KanjiCard key={k.id} k={k} onEdit={() => setEditing({ type: 'kanji', data: k })} onDelete={() => store.removeKanji(k.id)} />
              )) : <Empty label="kanji" />)}
            {tab === 'vocab' &&
              (filtered.vocab.length ? filtered.vocab.map((v) => (
                <VocabCard key={v.id} v={v} onEdit={() => setEditing({ type: 'vocab', data: v })} onDelete={() => store.removeVocab(v.id)} />
              )) : <Empty label="vocabulary" />)}
          </div>
        )}
      </div>

      {/* Editors */}
      {editing?.type === 'chunk' && (
        <ChunkEditor
          initial={editing.data}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            if (store.chunks.some((c) => c.id === d.id)) store.updateChunk(d.id, d)
            else store.addChunk(d)
            setEditing(null)
          }}
        />
      )}
      {editing?.type === 'pattern' && (
        <PatternEditor
          initial={editing.data}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            if (store.patterns.some((p) => p.id === d.id)) store.updatePattern(d.id, d)
            else store.addPattern(d)
            setEditing(null)
          }}
        />
      )}
      {editing?.type === 'kanji' && (
        <KanjiEditor
          initial={editing.data}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            if (store.kanji.some((k) => k.id === d.id)) store.updateKanji(d.id, d)
            else store.addKanji(d)
            setEditing(null)
          }}
        />
      )}
      {editing?.type === 'vocab' && (
        <VocabEditor
          initial={editing.data}
          onClose={() => setEditing(null)}
          onSave={(d) => {
            if (store.vocab.some((v) => v.id === d.id)) store.updateVocab(d.id, d)
            else store.addVocab(d)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

/* ---------------- Shared card chrome ---------------- */

function CardShell({
  children,
  onEdit,
  onDelete,
}: {
  children: React.ReactNode
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm transition-colors hover:border-primary/40">
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button onClick={onEdit} className="rounded p-1 text-muted-foreground hover:text-foreground" aria-label="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={onDelete} className="rounded p-1 text-muted-foreground hover:text-destructive" aria-label="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {children}
    </div>
  )
}

function ResultGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null
  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-primary">
        {title} · {count}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function Empty({ label }: { label: string }) {
  return (
    <p className="col-span-full rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
      No {label} yet. Click “Add” to record your first entry.
    </p>
  )
}

/* ---------------- Cards ---------------- */

function ChunkCard({ c, onEdit, onDelete }: { c: Chunk; onEdit: () => void; onDelete: () => void }) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete}>
      <div className="pr-12">
        <p className="font-jp-serif text-xl font-bold">{c.expression || c.title}</p>
        <p className="text-sm text-muted-foreground">
          {c.reading} {c.romaji && <span className="opacity-70">· {c.romaji}</span>}
        </p>
      </div>
      <p className="mt-2 text-sm">{c.meaning || c.portuguese}</p>
      {c.whenToUse && <p className="mt-1 text-xs text-muted-foreground">When: {c.whenToUse}</p>}
      {c.example && <p className="mt-2 rounded-lg bg-background/50 p-2 font-jp text-xs">{c.example}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={c.status} />
        {c.jlpt !== '-' && <Badge>{c.jlpt}</Badge>}
        {c.category && <Badge>{c.category}</Badge>}
        {c.tags.map((t) => (
          <Badge key={t}>#{t}</Badge>
        ))}
      </div>
    </CardShell>
  )
}

function PatternCard({ p, onEdit, onDelete }: { p: Pattern; onEdit: () => void; onDelete: () => void }) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete}>
      <p className="pr-12 font-jp-serif text-lg font-bold">{p.name}</p>
      {p.structure && <p className="mt-1 font-mono text-sm text-primary">{p.structure}</p>}
      {p.explanation && <p className="mt-2 text-sm text-muted-foreground">{p.explanation}</p>}
      {p.examples && <p className="mt-2 rounded-lg bg-background/50 p-2 font-jp text-xs">{p.examples}</p>}
      {p.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <Badge key={t}>#{t}</Badge>
          ))}
        </div>
      )}
    </CardShell>
  )
}

function KanjiCard({ k, onEdit, onDelete }: { k: KanjiEntry; onEdit: () => void; onDelete: () => void }) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete}>
      <div className="flex items-start gap-3 pr-12">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-jp-serif text-3xl font-black text-primary">
          {k.kanji}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">{k.meaning}</p>
          <p className="text-xs text-muted-foreground">ON: {k.on || '—'}</p>
          <p className="text-xs text-muted-foreground">KUN: {k.kun || '—'}</p>
        </div>
      </div>
      {k.relatedWords && <p className="mt-2 font-jp text-xs text-muted-foreground">{k.relatedWords}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={k.status} />
        {k.jlpt !== '-' && <Badge>{k.jlpt}</Badge>}
        {k.radical && <Badge>部 {k.radical}</Badge>}
      </div>
    </CardShell>
  )
}

function VocabCard({ v, onEdit, onDelete }: { v: VocabEntry; onEdit: () => void; onDelete: () => void }) {
  return (
    <CardShell onEdit={onEdit} onDelete={onDelete}>
      <div className="pr-12">
        <p className="font-jp-serif text-lg font-bold">{v.word}</p>
        <p className="text-sm text-muted-foreground">{v.reading}</p>
      </div>
      <p className="mt-1 text-sm">{v.meaning}</p>
      {v.example && <p className="mt-2 rounded-lg bg-background/50 p-2 font-jp text-xs">{v.example}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={v.status} />
        {v.jlpt !== '-' && <Badge>{v.jlpt}</Badge>}
        {v.partOfSpeech && <Badge>{v.partOfSpeech}</Badge>}
        {v.tags.map((t) => (
          <Badge key={t}>#{t}</Badge>
        ))}
      </div>
    </CardShell>
  )
}

/* ---------------- Editors ---------------- */

function EditorFooter({ onClose, onSave, disabled, isEdit }: { onClose: () => void; onSave: () => void; disabled: boolean; isEdit: boolean }) {
  return (
    <>
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button onClick={onSave} disabled={disabled}>{isEdit ? 'Save changes' : 'Add'}</Button>
    </>
  )
}

function StatusSelect({ value, onChange }: { value: LearnStatus; onChange: (s: LearnStatus) => void }) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as LearnStatus)}>
      {LEARN_STATUS.map((s) => (
        <option key={s.id} value={s.id}>{s.label}</option>
      ))}
    </Select>
  )
}

function JlptSelect({ value, onChange }: { value: JLPT; onChange: (j: JLPT) => void }) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as JLPT)}>
      {JLPT_LEVELS.map((j) => (
        <option key={j} value={j}>{j === '-' ? 'None' : j}</option>
      ))}
    </Select>
  )
}

function ChunkEditor({ initial, onClose, onSave }: { initial: Chunk; onClose: () => void; onSave: (c: Chunk) => void }) {
  const [d, setD] = useState(initial)
  const set = (p: Partial<Chunk>) => setD({ ...d, ...p })
  const isEdit = useOS.getState().chunks.some((c) => c.id === d.id)
  return (
    <Modal open onClose={onClose} kanji="塊" title={isEdit ? 'Edit chunk' : 'New chunk'}
      footer={<EditorFooter onClose={onClose} onSave={() => onSave(d)} disabled={!d.expression.trim() && !d.title.trim()} isEdit={isEdit} />}>
      <div className="grid gap-4">
        <Field label="Title"><Input value={d.title} onChange={(e) => set({ title: e.target.value })} placeholder="Short label" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Expression"><Input value={d.expression} onChange={(e) => set({ expression: e.target.value })} placeholder="お願いします" className="font-jp" /></Field>
          <Field label="Reading"><Input value={d.reading} onChange={(e) => set({ reading: e.target.value })} placeholder="おねがいします" className="font-jp" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Romaji"><Input value={d.romaji} onChange={(e) => set({ romaji: e.target.value })} placeholder="onegaishimasu" /></Field>
          <Field label="Português"><Input value={d.portuguese} onChange={(e) => set({ portuguese: e.target.value })} placeholder="por favor" /></Field>
        </div>
        <Field label="Meaning"><Input value={d.meaning} onChange={(e) => set({ meaning: e.target.value })} placeholder="please / I ask of you" /></Field>
        <Field label="When to use"><Textarea rows={2} value={d.whenToUse} onChange={(e) => set({ whenToUse: e.target.value })} /></Field>
        <Field label="Example"><Textarea rows={2} value={d.example} onChange={(e) => set({ example: e.target.value })} className="font-jp" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <Select value={d.category} onChange={(e) => set({ category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Frequency"><Input value={d.frequency} onChange={(e) => set({ frequency: e.target.value })} placeholder="High / Medium / Low" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="JLPT"><JlptSelect value={d.jlpt} onChange={(jlpt) => set({ jlpt })} /></Field>
          <Field label="Status"><StatusSelect value={d.status} onChange={(status) => set({ status })} /></Field>
          <Field label="Learned"><Input type="date" value={d.learnedDate} onChange={(e) => set({ learnedDate: e.target.value })} /></Field>
        </div>
        <Field label="Tags"><TagInput value={d.tags} onChange={(tags) => set({ tags })} /></Field>
      </div>
    </Modal>
  )
}

function PatternEditor({ initial, onClose, onSave }: { initial: Pattern; onClose: () => void; onSave: (p: Pattern) => void }) {
  const [d, setD] = useState(initial)
  const set = (p: Partial<Pattern>) => setD({ ...d, ...p })
  const isEdit = useOS.getState().patterns.some((p) => p.id === d.id)
  return (
    <Modal open onClose={onClose} kanji="型" title={isEdit ? 'Edit pattern' : 'New pattern'}
      footer={<EditorFooter onClose={onClose} onSave={() => onSave(d)} disabled={!d.name.trim()} isEdit={isEdit} />}>
      <div className="grid gap-4">
        <Field label="Name"><Input value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="〜ようになる" className="font-jp" /></Field>
        <Field label="Structure"><Input value={d.structure} onChange={(e) => set({ structure: e.target.value })} placeholder="Verb (potential) + ようになる" /></Field>
        <Field label="Explanation"><Textarea rows={3} value={d.explanation} onChange={(e) => set({ explanation: e.target.value })} /></Field>
        <Field label="Examples"><Textarea rows={3} value={d.examples} onChange={(e) => set({ examples: e.target.value })} className="font-jp" /></Field>
        <Field label="Notes"><Textarea rows={2} value={d.notes} onChange={(e) => set({ notes: e.target.value })} /></Field>
        <Field label="Links"><Input value={d.links} onChange={(e) => set({ links: e.target.value })} placeholder="https://..." /></Field>
        <Field label="Tags"><TagInput value={d.tags} onChange={(tags) => set({ tags })} /></Field>
      </div>
    </Modal>
  )
}

function KanjiEditor({ initial, onClose, onSave }: { initial: KanjiEntry; onClose: () => void; onSave: (k: KanjiEntry) => void }) {
  const [d, setD] = useState(initial)
  const set = (p: Partial<KanjiEntry>) => setD({ ...d, ...p })
  const isEdit = useOS.getState().kanji.some((k) => k.id === d.id)
  return (
    <Modal open onClose={onClose} kanji="漢" title={isEdit ? 'Edit kanji' : 'New kanji'}
      footer={<EditorFooter onClose={onClose} onSave={() => onSave(d)} disabled={!d.kanji.trim()} isEdit={isEdit} />}>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kanji"><Input value={d.kanji} onChange={(e) => set({ kanji: e.target.value })} placeholder="水" className="font-jp text-lg" /></Field>
          <Field label="Meaning"><Input value={d.meaning} onChange={(e) => set({ meaning: e.target.value })} placeholder="water" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ON reading"><Input value={d.on} onChange={(e) => set({ on: e.target.value })} placeholder="スイ" className="font-jp" /></Field>
          <Field label="KUN reading"><Input value={d.kun} onChange={(e) => set({ kun: e.target.value })} placeholder="みず" className="font-jp" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Radical"><Input value={d.radical} onChange={(e) => set({ radical: e.target.value })} className="font-jp" /></Field>
          <Field label="Frequency"><Input value={d.frequency} onChange={(e) => set({ frequency: e.target.value })} /></Field>
        </div>
        <Field label="Related words"><Textarea rows={2} value={d.relatedWords} onChange={(e) => set({ relatedWords: e.target.value })} className="font-jp" /></Field>
        <Field label="Sentences"><Textarea rows={2} value={d.sentences} onChange={(e) => set({ sentences: e.target.value })} className="font-jp" /></Field>
        <Field label="Notes"><Textarea rows={2} value={d.notes} onChange={(e) => set({ notes: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="JLPT"><JlptSelect value={d.jlpt} onChange={(jlpt) => set({ jlpt })} /></Field>
          <Field label="Status"><StatusSelect value={d.status} onChange={(status) => set({ status })} /></Field>
          <Field label="Date"><Input type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} /></Field>
        </div>
      </div>
    </Modal>
  )
}

function VocabEditor({ initial, onClose, onSave }: { initial: VocabEntry; onClose: () => void; onSave: (v: VocabEntry) => void }) {
  const [d, setD] = useState(initial)
  const set = (p: Partial<VocabEntry>) => setD({ ...d, ...p })
  const isEdit = useOS.getState().vocab.some((v) => v.id === d.id)
  return (
    <Modal open onClose={onClose} kanji="語" title={isEdit ? 'Edit vocabulary' : 'New vocabulary'}
      footer={<EditorFooter onClose={onClose} onSave={() => onSave(d)} disabled={!d.word.trim()} isEdit={isEdit} />}>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Word"><Input value={d.word} onChange={(e) => set({ word: e.target.value })} placeholder="勉強" className="font-jp" /></Field>
          <Field label="Reading"><Input value={d.reading} onChange={(e) => set({ reading: e.target.value })} placeholder="べんきょう" className="font-jp" /></Field>
        </div>
        <Field label="Meaning"><Input value={d.meaning} onChange={(e) => set({ meaning: e.target.value })} placeholder="study" /></Field>
        <Field label="Part of speech"><Input value={d.partOfSpeech} onChange={(e) => set({ partOfSpeech: e.target.value })} placeholder="noun / suru-verb" /></Field>
        <Field label="Example"><Textarea rows={2} value={d.example} onChange={(e) => set({ example: e.target.value })} className="font-jp" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="JLPT"><JlptSelect value={d.jlpt} onChange={(jlpt) => set({ jlpt })} /></Field>
          <Field label="Status"><StatusSelect value={d.status} onChange={(status) => set({ status })} /></Field>
        </div>
        <Field label="Tags"><TagInput value={d.tags} onChange={(tags) => set({ tags })} /></Field>
      </div>
    </Modal>
  )
}

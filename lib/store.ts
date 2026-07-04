'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Activity,
  AreaId,
  Chunk,
  Day,
  DayMetric,
  Issue,
  IssueStatus,
  KanjiEntry,
  MetricsState,
  Pattern,
  ReviewState,
  VocabEntry,
} from './types'
import { currentWeekId } from './week'

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))

interface OSState {
  // active week shared by metrics + review
  activeWeek: string
  setActiveWeek: (weekId: string) => void

  // weekly metrics
  metrics: MetricsState
  setMetric: (weekId: string, area: AreaId, day: Day, patch: Partial<DayMetric>) => void

  // schedule
  activities: Activity[]
  addActivity: (a: Omit<Activity, 'id'>) => void
  updateActivity: (id: string, patch: Partial<Activity>) => void
  removeActivity: (id: string) => void
  duplicateActivity: (id: string) => void

  // japanese KB
  chunks: Chunk[]
  patterns: Pattern[]
  kanji: KanjiEntry[]
  vocab: VocabEntry[]
  addChunk: (c: Chunk) => void
  updateChunk: (id: string, patch: Partial<Chunk>) => void
  removeChunk: (id: string) => void
  addPattern: (p: Pattern) => void
  updatePattern: (id: string, patch: Partial<Pattern>) => void
  removePattern: (id: string) => void
  addKanji: (k: KanjiEntry) => void
  updateKanji: (id: string, patch: Partial<KanjiEntry>) => void
  removeKanji: (id: string) => void
  addVocab: (v: VocabEntry) => void
  updateVocab: (id: string, patch: Partial<VocabEntry>) => void
  removeVocab: (id: string) => void

  // programming issues
  issues: Issue[]
  addIssue: (i: Issue) => void
  updateIssue: (id: string, patch: Partial<Issue>) => void
  removeIssue: (id: string) => void
  duplicateIssue: (id: string) => void
  moveIssue: (id: string, status: IssueStatus) => void

  // review
  review: ReviewState
  setReview: (weekId: string, key: string, value: string) => void
}

const emptyDayMetric: DayMetric = { passive: '', active: '', annotations: '', observations: '' }

export const useOS = create<OSState>()(
  persist(
    (set) => ({
      activeWeek: currentWeekId(),
      setActiveWeek: (weekId) => set({ activeWeek: weekId }),

      metrics: {},
      setMetric: (weekId, area, day, patch) =>
        set((s) => {
          const week = s.metrics[weekId] ?? {}
          const areaData = week[area] ?? {}
          const dayData = { ...emptyDayMetric, ...areaData[day], ...patch }
          return {
            metrics: {
              ...s.metrics,
              [weekId]: { ...week, [area]: { ...areaData, [day]: dayData } },
            },
          }
        }),

      activities: [],
      addActivity: (a) => set((s) => ({ activities: [...s.activities, { ...a, id: uid() }] })),
      updateActivity: (id, patch) =>
        set((s) => ({ activities: s.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),
      removeActivity: (id) => set((s) => ({ activities: s.activities.filter((a) => a.id !== id) })),
      duplicateActivity: (id) =>
        set((s) => {
          const orig = s.activities.find((a) => a.id === id)
          if (!orig) return {}
          return { activities: [...s.activities, { ...orig, id: uid(), title: `${orig.title} (copy)` }] }
        }),

      chunks: [],
      patterns: [],
      kanji: [],
      vocab: [],
      addChunk: (c) => set((s) => ({ chunks: [c, ...s.chunks] })),
      updateChunk: (id, patch) =>
        set((s) => ({ chunks: s.chunks.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      removeChunk: (id) => set((s) => ({ chunks: s.chunks.filter((c) => c.id !== id) })),
      addPattern: (p) => set((s) => ({ patterns: [p, ...s.patterns] })),
      updatePattern: (id, patch) =>
        set((s) => ({ patterns: s.patterns.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      removePattern: (id) => set((s) => ({ patterns: s.patterns.filter((p) => p.id !== id) })),
      addKanji: (k) => set((s) => ({ kanji: [k, ...s.kanji] })),
      updateKanji: (id, patch) =>
        set((s) => ({ kanji: s.kanji.map((k) => (k.id === id ? { ...k, ...patch } : k)) })),
      removeKanji: (id) => set((s) => ({ kanji: s.kanji.filter((k) => k.id !== id) })),
      addVocab: (v) => set((s) => ({ vocab: [v, ...s.vocab] })),
      updateVocab: (id, patch) =>
        set((s) => ({ vocab: s.vocab.map((v) => (v.id === id ? { ...v, ...patch } : v)) })),
      removeVocab: (id) => set((s) => ({ vocab: s.vocab.filter((v) => v.id !== id) })),

      issues: [],
      addIssue: (i) => set((s) => ({ issues: [i, ...s.issues] })),
      updateIssue: (id, patch) =>
        set((s) => ({ issues: s.issues.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
      removeIssue: (id) => set((s) => ({ issues: s.issues.filter((i) => i.id !== id) })),
      duplicateIssue: (id) =>
        set((s) => {
          const orig = s.issues.find((i) => i.id === id)
          if (!orig) return {}
          return {
            issues: [
              { ...orig, id: uid(), title: `${orig.title} (copy)`, createdAt: new Date().toISOString() },
              ...s.issues,
            ],
          }
        }),
      moveIssue: (id, status) =>
        set((s) => ({ issues: s.issues.map((i) => (i.id === id ? { ...i, status } : i)) })),

      review: {},
      setReview: (weekId, key, value) =>
        set((s) => ({
          review: { ...s.review, [weekId]: { ...s.review[weekId], [key]: value } },
        })),
    }),
    { name: 'kessho-os-v2' },
  ),
)

export { uid }

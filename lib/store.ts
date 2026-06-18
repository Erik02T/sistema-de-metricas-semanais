'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AREA_META, METRICS, type Area } from './data'

export interface WeekRecord {
  id: string
  date: string
  final: number
  japanese: number
  programming: number
  university: number
}

interface POSState {
  results: Record<string, number>
  progDone: Record<string, boolean>
  jpActive: Record<string, boolean>
  jpPassive: Record<string, boolean>
  reviewNotes: Record<string, string>
  history: WeekRecord[]
  setResult: (id: string, value: number) => void
  toggleProg: (id: string) => void
  toggleJp: (group: 'active' | 'passive', id: string) => void
  setNote: (id: string, value: string) => void
  saveWeek: () => void
  resetWeek: () => void
  clearHistory: () => void
}

export const usePOS = create<POSState>()(
  persist(
    (set) => ({
      results: {},
      progDone: {},
      jpActive: {},
      jpPassive: {},
      reviewNotes: {},
      history: [],
      setResult: (id, value) =>
        set((s) => ({ results: { ...s.results, [id]: Math.max(0, value) } })),
      toggleProg: (id) =>
        set((s) => ({ progDone: { ...s.progDone, [id]: !s.progDone[id] } })),
      toggleJp: (group, id) =>
        set((s) => {
          const key = group === 'active' ? 'jpActive' : 'jpPassive'
          return { [key]: { ...s[key], [id]: !s[key][id] } } as Partial<POSState>
        }),
      setNote: (id, value) =>
        set((s) => ({ reviewNotes: { ...s.reviewNotes, [id]: value } })),
      saveWeek: () =>
        set((s) => {
          const scores = computeScores(s.results)
          const record: WeekRecord = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            final: scores.final,
            japanese: scores.byArea.japanese,
            programming: scores.byArea.programming,
            university: scores.byArea.university,
          }
          return { history: [record, ...s.history].slice(0, 24) }
        }),
      resetWeek: () => set({ results: {}, jpActive: {}, jpPassive: {} }),
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'kessho-pos-v1' },
  ),
)

export function computeScores(results: Record<string, number>) {
  const byArea: Record<Area, number> = {
    japanese: 0,
    programming: 0,
    university: 0,
  }
  ;(Object.keys(byArea) as Area[]).forEach((area) => {
    const metrics = METRICS.filter((m) => m.area === area)
    const sum = metrics.reduce((acc, m) => {
      const r = results[m.id] ?? 0
      return acc + Math.min(r / m.target, 1)
    }, 0)
    byArea[area] = Math.round((sum / metrics.length) * 100)
  })

  const final = Math.round(
    byArea.japanese * AREA_META.japanese.weight +
      byArea.programming * AREA_META.programming.weight +
      byArea.university * AREA_META.university.weight,
  )

  return { byArea, final }
}

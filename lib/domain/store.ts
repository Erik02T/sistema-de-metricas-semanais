'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_STATE, type AdaptiveTask, type DailyContext, type FocusBlock, type Objective, type OSState, type WeeklyReview } from './types'
import { currentContextKey } from '@/lib/dates'

interface AdaptiveActions {
  addObjective: (objective: Objective) => void
  updateObjective: (id: string, patch: Partial<Objective>) => void
  addWeeklyGoal: (goal: import('./types').WeeklyGoal) => void
  updateWeeklyGoal: (id: string, patch: Partial<import('./types').WeeklyGoal>) => void
  addTask: (task: AdaptiveTask) => void
  updateTask: (id: string, patch: Partial<AdaptiveTask>) => void
  setContext: (context: DailyContext) => void
  addBlock: (block: FocusBlock) => void
  updateBlock: (id: string, patch: Partial<FocusBlock>) => void
  setReview: (review: WeeklyReview) => void
}

export const useAdaptiveOS = create<OSState & AdaptiveActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      addObjective: (objective) => set((state) => ({ objectives: [...state.objectives, objective] })),
      updateObjective: (id, patch) => set((state) => ({ objectives: state.objectives.map((item) => item.id === id ? { ...item, ...patch } : item) })),
      addWeeklyGoal: (goal) => set((state) => ({ weeklyGoals: [...state.weeklyGoals, goal] })),
      updateWeeklyGoal: (id, patch) => set((state) => ({ weeklyGoals: state.weeklyGoals.map((item) => item.id === id ? { ...item, ...patch } : item) })),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, patch) => set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? { ...task, ...patch } : task) })),
      setContext: (context) => set((state) => ({ contexts: { ...state.contexts, [context.date]: context } })),
      addBlock: (block) => set((state) => ({ blocks: [block, ...state.blocks] })),
      updateBlock: (id, patch) => set((state) => ({ blocks: state.blocks.map((block) => block.id === id ? { ...block, ...patch } : block) })),
      setReview: (review) => set((state) => ({ reviews: { ...state.reviews, [review.weekId]: review } })),
    }),
    {
      name: 'kessho-adaptive-os',
      version: 1,
      migrate: (persisted) => {
        const state = persisted as Partial<OSState>
        return { ...DEFAULT_STATE, ...state, version: 1, legacyImported: true }
      },
    },
  ),
)

export function defaultDailyContext(): DailyContext {
  const { date, weekId, timeZone } = currentContextKey(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  return { date, weekId, timezone: timeZone, availableMinutes: 30, energy: 'medium', focusMinutes: 30, commitments: '' }
}

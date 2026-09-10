'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_STATE, DEFAULT_AREAS, type AdaptiveTask, type DailyContext, type FocusBlock, type Objective, type OSState, type WeeklyReview, type OSPreferences, type StudySession, type Insight, type Metric, type Area } from './types'
import { currentContextKey } from '@/lib/dates'

interface AdaptiveActions {
  addArea: (area: Area) => void
  updateArea: (id: string, patch: Partial<import('./types').Area>) => void
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
  setPreferences: (preferences: Partial<OSPreferences>) => void
  replaceState: (state: OSState) => void
  resetState: () => void
  addSession: (session: StudySession) => void
  updateSession: (id: string, patch: Partial<StudySession>) => void
  setInsights: (insights: Insight[]) => void
  addMetric: (metric: Metric) => void
  replanTasks: (taskIds: string[], reason: string) => void
}

export const useAdaptiveOS = create<OSState & AdaptiveActions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      addArea: (area) => set((state) => ({ areas: [...state.areas, area] })),
      updateArea: (id, patch) => set((state) => ({ areas: state.areas.map((area) => area.id === id ? { ...area, ...patch } : area) })),
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
      setPreferences: (preferences) => set((state) => ({ preferences: { ...state.preferences, ...preferences } })),
      replaceState: (nextState) => set(() => ({ ...DEFAULT_STATE, ...nextState, version: 3 })),
      resetState: () => set(() => ({ ...DEFAULT_STATE })),
      addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
      updateSession: (id, patch) => set((state) => ({ sessions: state.sessions.map((session) => session.id === id ? { ...session, ...patch } : session) })),
      setInsights: (insights) => set(() => ({ insights })),
      addMetric: (metric) => set((state) => ({ metrics: [metric, ...state.metrics] })),
      replanTasks: (taskIds, reason) => set((state) => ({ tasks: state.tasks.map((task) => taskIds.includes(task.id) && !['completed', 'skipped'].includes(task.status) ? { ...task, status: 'backlog', evidence: `Replanned: ${reason}` } : task) })),
    }),
    {
      name: 'kessho-adaptive-os',
      version: 4,
      migrate: (persisted) => {
        const state = persisted as Partial<OSState>
        return { ...DEFAULT_STATE, ...state, user: { ...DEFAULT_STATE.user, ...(state.user || {}) }, preferences: { ...DEFAULT_STATE.preferences, ...(state.preferences || {}) }, areas: state.areas || DEFAULT_AREAS, objectives: (state.objectives || DEFAULT_STATE.objectives).map((objective) => ({ ...objective, minimumOutcome: objective.minimumOutcome || 'Make a small meaningful move.', targetOutcome: objective.targetOutcome || objective.description, idealOutcome: objective.idealOutcome || 'Create evidence that compounds.', minimumMinutes: objective.minimumMinutes || 15, targetMinutes: objective.targetMinutes || 60, idealMinutes: objective.idealMinutes || 120 })), sessions: state.sessions || [], insights: state.insights || [], metrics: state.metrics || [], version: 4, legacyImported: true }
      },
    },
  ),
)

export function defaultDailyContext(): DailyContext {
  const { date, weekId, timeZone } = currentContextKey(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')
  return { date, weekId, timezone: timeZone, availableMinutes: 30, energy: 'medium', focusMinutes: 30, commitmentPressure: 'low', commitments: '' }
}

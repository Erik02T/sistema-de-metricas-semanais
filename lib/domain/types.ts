export type AreaId = 'japanese' | 'programming' | 'university'
export type EnergyLevel = 'low' | 'medium' | 'high'
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'blocked' | 'completed' | 'skipped'
export type GoalStatus = 'planned' | 'active' | 'at-risk' | 'completed'
export type WeekHealthStatus = 'ON_TRACK' | 'ATTENTION' | 'AT_RISK' | 'COMPLETED'

export interface User {
  id: string
  name: string
  timezone: string
  createdAt: string
}

export interface Area {
  id: AreaId
  label: string
  description: string
  weeklyMinutes: number
  status: 'active' | 'paused'
}

export interface Objective {
  id: string
  title: string
  description: string
  areaId: AreaId
  why: string
  priority: number
  minimumOutcome: string
  targetOutcome: string
  idealOutcome: string
  minimumMinutes: number
  targetMinutes: number
  idealMinutes: number
  status: 'active' | 'paused' | 'completed'
  createdAt: string
}

export interface WeeklyGoal {
  id: string
  objectiveId: string
  weekId: string
  title: string
  desiredOutcome: string
  minimumOutcome: string
  targetMinutes: number
  actualMinutes: number
  progress: number
  priority: number
  status: GoalStatus
}

export interface AdaptiveTask {
  id: string
  title: string
  description: string
  areaId: AreaId
  objectiveId?: string
  weeklyGoalId?: string
  status: TaskStatus
  priority: number
  estimatedMinutes: number
  minimumMinutes: number
  energyRequired: EnergyLevel
  dueDate?: string
  nextAction: string
  evidence?: string
  createdAt: string
  completedAt?: string
}

export interface DailyContext {
  date: string
  weekId: string
  timezone: string
  availableMinutes: number
  energy: EnergyLevel
  focusMinutes: number
  commitmentPressure: 'low' | 'medium' | 'high'
  commitments: string
  dayChanged?: string
  priorityTaskId?: string
}

export type SessionKind = 'study' | 'activity'
export type SessionStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled' | 'skipped'

export interface StudySession {
  id: string
  kind: SessionKind
  areaId: AreaId
  taskId?: string
  objectiveId?: string
  startedAt: string
  endedAt?: string
  plannedMinutes: number
  actualMinutes: number
  status: SessionStatus
  result: string
  evidence: string
  cancelReason?: string
}

export interface Insight {
  id: string
  type: 'best-day' | 'ideal-duration' | 'neglected-area' | 'recurring-goal' | 'streak'
  title: string
  detail: string
  value: number
  generatedAt: string
}

export interface Metric {
  id: string
  key: string
  value: number
  unit: 'minutes' | 'count' | 'score' | 'days'
  period: string
  source: 'session' | 'task' | 'goal' | 'system'
  recordedAt: string
}

export interface FocusBlock {
  id: string
  date: string
  taskId: string
  plannedMinutes: number
  actualMinutes: number
  energyBefore: EnergyLevel
  energyAfter?: EnergyLevel
  status: 'planned' | 'active' | 'completed' | 'cancelled' | 'skipped'
  result: string
  createdAt: string
}

export interface WeeklyReview {
  weekId: string
  wins: string
  failures: string
  unfinished: string
  distractions: string
  lessons: string
  nextWeekDecision: string
  updatedAt: string
}

export interface WeekHealth {
  status: WeekHealthStatus
  label: string
  progress: number
  completedGoals: number
  totalGoals: number
  plannedMinutes: number
  actualMinutes: number
  message: string
}

export interface Scorecard {
  weekId: string
  plannedMinutes: number
  actualMinutes: number
  completedActions: number
  expectedActions: number
  outcomes: number
  consistency: number
  energyManagement: number
  overallScore: number
}

export interface Recommendation {
  task: AdaptiveTask
  score: number
  reason: string
  alternativeMinutes: number
  alternativeReason: string
}

export interface OSPreferences {
  timezone: string
  focusDefaultMinutes: number
  weekStartsMonday: boolean
}

export interface OSState {
  version: number
  user: User
  preferences: OSPreferences
  areas: Area[]
  objectives: Objective[]
  weeklyGoals: WeeklyGoal[]
  tasks: AdaptiveTask[]
  contexts: Record<string, DailyContext>
  blocks: FocusBlock[]
  reviews: Record<string, WeeklyReview>
  sessions: StudySession[]
  insights: Insight[]
  metrics: Metric[]
  legacyImported: boolean
}

export const DEFAULT_AREAS: Area[] = [
  { id: 'japanese', label: 'Japanese', description: 'Comprehension and expression.', weeklyMinutes: 180, status: 'active' },
  { id: 'programming', label: 'Programming', description: 'Problem solving and software foundations.', weeklyMinutes: 240, status: 'active' },
  { id: 'university', label: 'University', description: 'Requirements and academic progress.', weeklyMinutes: 120, status: 'active' },
]

export const DEFAULT_OBJECTIVES: Objective[] = [
  { id: 'obj-japanese', title: 'Become conversational in Japanese', description: 'Build practical comprehension and expression through consistent exposure.', areaId: 'japanese', why: 'Communicate with confidence and understand real Japanese.', priority: 1, minimumOutcome: 'Review one small set of chunks.', targetOutcome: 'Build practical comprehension and expression.', idealOutcome: 'Use the language in a real conversation.', minimumMinutes: 15, targetMinutes: 180, idealMinutes: 300, status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'obj-programming', title: 'Build strong software engineering foundations', description: 'Develop logic, systems thinking and reliable delivery habits.', areaId: 'programming', why: 'Become capable of building useful software independently.', priority: 2, minimumOutcome: 'Solve one small problem.', targetOutcome: 'Develop logic and reliable delivery habits.', idealOutcome: 'Ship a useful software improvement.', minimumMinutes: 15, targetMinutes: 240, idealMinutes: 360, status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'obj-university', title: 'Finish university requirements', description: 'Keep academic obligations visible and moving forward.', areaId: 'university', why: 'Protect long-term academic progress without last-minute pressure.', priority: 3, minimumOutcome: 'Define the next academic deliverable.', targetOutcome: 'Move the next requirement forward.', idealOutcome: 'Finish a complete university requirement.', minimumMinutes: 15, targetMinutes: 120, idealMinutes: 240, status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
]

export const DEFAULT_TASKS: AdaptiveTask[] = [
  { id: 'task-jp', title: 'Review Japanese chunks', description: 'Review a focused set of saved chunks and write one example.', areaId: 'japanese', objectiveId: 'obj-japanese', status: 'todo', priority: 1, estimatedMinutes: 25, minimumMinutes: 8, energyRequired: 'low', nextAction: 'Open the chunk list and choose ten items.', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'task-code', title: 'Solve one programming problem', description: 'Complete one small logic exercise and write the key insight.', areaId: 'programming', objectiveId: 'obj-programming', status: 'todo', priority: 2, estimatedMinutes: 45, minimumMinutes: 15, energyRequired: 'medium', nextAction: 'Choose the smallest unsolved problem.', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'task-university', title: 'Advance the next university requirement', description: 'Identify the next concrete deliverable and move it forward.', areaId: 'university', objectiveId: 'obj-university', status: 'backlog', priority: 3, estimatedMinutes: 60, minimumMinutes: 20, energyRequired: 'high', nextAction: 'Open the requirement and define the next submission step.', createdAt: '2026-01-01T00:00:00.000Z' },
]

export const DEFAULT_STATE: OSState = { version: 4, user: { id: 'local-user', name: 'Local workspace', timezone: 'UTC', createdAt: '2026-01-01T00:00:00.000Z' }, preferences: { timezone: 'UTC', focusDefaultMinutes: 30, weekStartsMonday: true }, areas: DEFAULT_AREAS, objectives: DEFAULT_OBJECTIVES.map((objective) => ({ ...objective, minimumOutcome: 'Make a small meaningful move.', targetOutcome: objective.description, idealOutcome: 'Create evidence that compounds.', minimumMinutes: 15, targetMinutes: 60, idealMinutes: 120 })), weeklyGoals: [], tasks: DEFAULT_TASKS, contexts: {}, blocks: [], reviews: {}, sessions: [], insights: [], metrics: [], legacyImported: false }

// Domain types for the Personal Knowledge & Study OS

export type AreaId =
  | 'japanese'
  | 'english'
  | 'programming'
  | 'university'
  | 'reading'
  | 'fitness'
  | 'projects'

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export type Day = (typeof DAYS)[number]

/* ---------------- Weekly Metrics ---------------- */

export interface DayMetric {
  passive: string // free duration text, e.g. "3h"
  active: string // e.g. "30min"
  annotations: string
  observations: string
}

// weekId -> areaId -> day -> DayMetric
export type MetricsState = Record<string, Partial<Record<AreaId, Partial<Record<Day, DayMetric>>>>>

/* ---------------- Weekly Schedule ---------------- */

export type ActivityStatus = 'planned' | 'in-progress' | 'done' | 'cancelled'

export interface Activity {
  id: string
  title: string
  area: AreaId
  color: string
  start: string // "08:00"
  end: string // "09:00"
  day: Day
  description: string
  status: ActivityStatus
}

/* ---------------- Japanese Knowledge Base ---------------- */

export type JLPT = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | '-'
export type LearnStatus = 'new' | 'reviewing' | 'mastered'

export interface Chunk {
  id: string
  title: string
  expression: string
  reading: string
  romaji: string
  portuguese: string
  meaning: string
  whenToUse: string
  example: string
  category: string
  tags: string[]
  jlpt: JLPT
  frequency: string
  learnedDate: string
  status: LearnStatus
}

export interface Pattern {
  id: string
  name: string
  structure: string
  explanation: string
  examples: string
  notes: string
  links: string
  tags: string[]
}

export interface KanjiEntry {
  id: string
  kanji: string
  on: string
  kun: string
  meaning: string
  radical: string
  jlpt: JLPT
  frequency: string
  relatedWords: string
  sentences: string
  notes: string
  date: string
  status: LearnStatus
}

export interface VocabEntry {
  id: string
  word: string
  reading: string
  meaning: string
  partOfSpeech: string
  example: string
  tags: string[]
  jlpt: JLPT
  status: LearnStatus
}

/* ---------------- Programming Issues ---------------- */

export type IssueStatus = 'backlog' | 'todo' | 'doing' | 'blocked' | 'done'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface Issue {
  id: string
  title: string
  description: string
  project: string
  area: AreaId
  priority: Priority
  status: IssueStatus
  createdAt: string
  dueDate: string
  checklist: ChecklistItem[]
  notes: string
  links: string
  tags: string[]
}

/* ---------------- Weekly Review ---------------- */

// weekId -> free-form fields keyed by string
export type ReviewState = Record<string, Record<string, string>>

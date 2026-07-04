import type {
  AreaId,
  IssueStatus,
  Priority,
  ActivityStatus,
  LearnStatus,
  JLPT,
} from './types'

export interface AreaMeta {
  id: AreaId
  label: string
  kanji: string
  color: string // css var reference
  dot: string
}

// Colors constrained to the Japanese palette: red (hinomaru), sakura pink, white, crimson, rose
export const AREAS: AreaMeta[] = [
  { id: 'japanese', label: 'Japanese', kanji: '語', color: 'var(--primary)', dot: 'oklch(0.575 0.214 25)' },
  { id: 'english', label: 'English', kanji: '英', color: 'var(--sakura)', dot: 'oklch(0.8 0.09 8)' },
  { id: 'programming', label: 'Programming', kanji: '工', color: 'var(--foreground)', dot: 'oklch(0.965 0.003 60)' },
  { id: 'university', label: 'University', kanji: '大', color: 'oklch(0.45 0.12 18)', dot: 'oklch(0.45 0.12 18)' },
  { id: 'reading', label: 'Reading', kanji: '読', color: 'var(--sakura-soft)', dot: 'oklch(0.88 0.05 6)' },
  { id: 'fitness', label: 'Fitness', kanji: '体', color: 'oklch(0.66 0.2 30)', dot: 'oklch(0.66 0.2 30)' },
  { id: 'projects', label: 'Personal Projects', kanji: '作', color: 'oklch(0.72 0.11 12)', dot: 'oklch(0.72 0.11 12)' },
]

export const AREA_MAP: Record<AreaId, AreaMeta> = Object.fromEntries(
  AREAS.map((a) => [a.id, a]),
) as Record<AreaId, AreaMeta>

export const DAY_KANJI: Record<string, string> = {
  Monday: '月',
  Tuesday: '火',
  Wednesday: '水',
  Thursday: '木',
  Friday: '金',
  Saturday: '土',
  Sunday: '日',
}

/* ---------------- Schedule config ---------------- */

export const ACTIVITY_STATUS: { id: ActivityStatus; label: string; tone: string }[] = [
  { id: 'planned', label: 'Planned', tone: 'var(--muted-foreground)' },
  { id: 'in-progress', label: 'In Progress', tone: 'var(--sakura)' },
  { id: 'done', label: 'Done', tone: 'var(--success)' },
  { id: 'cancelled', label: 'Cancelled', tone: 'var(--destructive)' },
]

/* ---------------- Programming Kanban config ---------------- */

export const ISSUE_COLUMNS: { id: IssueStatus; label: string; kanji: string }[] = [
  { id: 'backlog', label: 'Backlog', kanji: '控' },
  { id: 'todo', label: 'Todo', kanji: '予' },
  { id: 'doing', label: 'Doing', kanji: '進' },
  { id: 'blocked', label: 'Blocked', kanji: '壁' },
  { id: 'done', label: 'Done', kanji: '済' },
]

export const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: 'low', label: 'Low', color: 'var(--muted-foreground)' },
  { id: 'medium', label: 'Medium', color: 'var(--sakura)' },
  { id: 'high', label: 'High', color: 'oklch(0.66 0.2 30)' },
  { id: 'urgent', label: 'Urgent', color: 'var(--primary)' },
]

/* ---------------- Shared learn-status config ---------------- */

export const LEARN_STATUS: { id: LearnStatus; label: string; kanji: string; color: string }[] = [
  { id: 'new', label: 'New', kanji: '新', color: 'var(--sakura)' },
  { id: 'reviewing', label: 'Reviewing', kanji: '復', color: 'oklch(0.66 0.2 30)' },
  { id: 'mastered', label: 'Mastered', kanji: '極', color: 'var(--success)' },
]

export const JLPT_LEVELS: JLPT[] = ['N5', 'N4', 'N3', 'N2', 'N1', '-']

/* ---------------- Weekly Review config ---------------- */

export interface ReviewArea {
  id: string
  label: string
  kanji: string
  fields: { key: string; label: string }[]
}

export const REVIEW_AREAS: ReviewArea[] = [
  {
    id: 'japanese',
    label: 'Japanese',
    kanji: '語',
    fields: [
      { key: 'chunks', label: 'Chunks learned' },
      { key: 'patterns', label: 'Patterns learned' },
      { key: 'kanji', label: 'Kanji learned' },
      { key: 'vocab', label: 'Vocabulary learned' },
      { key: 'notes', label: 'Notes' },
    ],
  },
  {
    id: 'programming',
    label: 'Programming',
    kanji: '工',
    fields: [
      { key: 'concepts', label: 'Concepts' },
      { key: 'frameworks', label: 'Frameworks' },
      { key: 'bugs', label: 'Bugs solved' },
      { key: 'learnings', label: 'Learnings' },
    ],
  },
  {
    id: 'english',
    label: 'English',
    kanji: '英',
    fields: [
      { key: 'vocab', label: 'Vocabulary' },
      { key: 'expressions', label: 'Expressions' },
      { key: 'grammar', label: 'Grammar' },
      { key: 'listening', label: 'Listening' },
    ],
  },
  {
    id: 'university',
    label: 'University',
    kanji: '大',
    fields: [
      { key: 'content', label: 'Content' },
      { key: 'summaries', label: 'Summaries' },
      { key: 'pending', label: 'Pending' },
    ],
  },
]

export const REVIEW_CHECK = [
  { key: 'reviewed', label: 'Reviewed', kanji: '済' },
  { key: 'need-review', label: 'Still need to review', kanji: '未' },
  { key: 'mastered', label: 'Mastered', kanji: '極' },
]

export const REFLECTION_QUESTIONS = [
  { key: 'learned', label: 'What did I learn?' },
  { key: 'hard', label: 'What was difficult?' },
  { key: 'improve', label: 'What can I improve?' },
  { key: 'distraction', label: 'Biggest distraction?' },
  { key: 'avoid', label: 'How to avoid it?' },
  { key: 'goal', label: 'Goal for next week' },
]

export const CATEGORIES = ['Greeting', 'Daily life', 'Business', 'Casual', 'Grammar', 'Slang', 'Travel']

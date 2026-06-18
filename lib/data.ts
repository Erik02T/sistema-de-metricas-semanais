export type Area = 'japanese' | 'programming' | 'university'

export interface Metric {
  id: string
  area: Area
  label: string
  kanji: string
  target: number
  unit?: string
  hint?: string
}

export const AREA_META: Record<
  Area,
  { label: string; kanji: string; weight: number; color: string }
> = {
  japanese: { label: 'Japanese', kanji: '日本語', weight: 0.4, color: 'var(--primary)' },
  programming: { label: 'Programming', kanji: '工学', weight: 0.4, color: 'var(--aoi)' },
  university: { label: 'University', kanji: '大学', weight: 0.2, color: 'var(--gold)' },
}

export const METRICS: Metric[] = [
  { id: 'jp-words', area: 'japanese', label: 'Japanese Words', kanji: '語', target: 35, unit: 'words' },
  { id: 'kanji', area: 'japanese', label: 'Kanji', kanji: '漢', target: 35, unit: 'kanji' },
  { id: 'anki', area: 'japanese', label: 'Anki Reviews', kanji: '復', target: 7, unit: 'days' },
  { id: 'grammar', area: 'japanese', label: 'Grammar Sessions', kanji: '文', target: 3, unit: 'sessions' },
  { id: 'jp-input', area: 'japanese', label: 'Japanese Input', kanji: '聴', target: 7, unit: 'h' },
  { id: 'prog-study', area: 'programming', label: 'Programming Study', kanji: '学', target: 7, unit: 'h' },
  { id: 'exercism', area: 'programming', label: 'Exercism Problems', kanji: '問', target: 7, unit: 'problems' },
  { id: 'mini-proj', area: 'programming', label: 'Mini Projects', kanji: '作', target: 1, unit: 'project' },
  { id: 'uni-sessions', area: 'university', label: 'University Sessions', kanji: '究', target: 3, unit: 'sessions' },
  { id: 'weekly-review', area: 'university', label: 'Weekly Review', kanji: '省', target: 1, unit: 'review' },
]

export interface NorthStarGoal {
  kanji: string
  flag: string
  title: string
  body: string
  accent: 'primary' | 'aoi' | 'gold'
}

export const NORTH_STAR: NorthStarGoal[] = [
  {
    kanji: '日本語',
    flag: '🇯🇵',
    title: 'Japanese',
    body: 'Reach conversational level and prepare for life in Japan.',
    accent: 'primary',
  },
  {
    kanji: '工学',
    flag: '💻',
    title: 'Software Engineering',
    body: 'Build strong fundamentals and understand backend architecture deeply.',
    accent: 'aoi',
  },
  {
    kanji: '大学',
    flag: '🎓',
    title: 'University',
    body: 'Pass all subjects without neglecting them.',
    accent: 'gold',
  },
]

export interface ScheduleBlock {
  title: string
  duration?: string
  items: string[]
  area: Area | 'deep' | 'review'
}

export interface ScheduleDay {
  day: string
  kanji: string
  blocks: ScheduleBlock[]
}

export const SCHEDULE: ScheduleDay[] = [
  {
    day: 'Monday',
    kanji: '月',
    blocks: [
      { title: 'Japanese', duration: '1h', area: 'japanese', items: ['5 words', '5 kanji', 'Anki', 'Reading'] },
      { title: 'Programming', duration: '1h', area: 'programming', items: ['Variables', 'Types', 'Operators'] },
    ],
  },
  {
    day: 'Tuesday',
    kanji: '火',
    blocks: [
      { title: 'University', duration: '2h', area: 'university', items: ['Assignments', 'Classes', 'Notes'] },
      { title: 'Japanese Input', area: 'japanese', items: ['Podcast', 'Anime'] },
    ],
  },
  {
    day: 'Wednesday',
    kanji: '水',
    blocks: [
      { title: 'Japanese', duration: '1h', area: 'japanese', items: ['Grammar', 'Sentence mining'] },
      { title: 'Programming', duration: '1h', area: 'programming', items: ['Conditionals', 'Exercises'] },
    ],
  },
  {
    day: 'Thursday',
    kanji: '木',
    blocks: [
      { title: 'University', duration: '2h', area: 'university', items: ['Assignments', 'Study'] },
      { title: 'Japanese Input', area: 'japanese', items: ['Listening'] },
    ],
  },
  {
    day: 'Friday',
    kanji: '金',
    blocks: [
      { title: 'Japanese', duration: '1h', area: 'japanese', items: ['Review'] },
      { title: 'Programming', duration: '1h', area: 'programming', items: ['Loops', 'Exercism'] },
    ],
  },
  {
    day: 'Saturday',
    kanji: '土',
    blocks: [
      { title: 'Deep Work — Japanese', duration: '2h', area: 'deep', items: ['Focused immersion', 'Output practice'] },
      {
        title: 'Deep Work — Programming',
        duration: '2h',
        area: 'deep',
        items: ['Build mini-project', 'IMC Calculator', 'FizzBuzz', 'Prime Number Checker'],
      },
    ],
  },
  {
    day: 'Sunday',
    kanji: '日',
    blocks: [
      {
        title: 'Weekly Review',
        duration: '30 min',
        area: 'review',
        items: ['Reflect', 'Recalibrate', 'Plan next week'],
      },
    ],
  },
]

export interface ChecklistItem {
  id: string
  label: string
  kanji: string
}

export const JP_ACTIVE: ChecklistItem[] = [
  { id: 'a-words', label: '5 words', kanji: '語' },
  { id: 'a-kanji', label: '5 kanji', kanji: '漢' },
  { id: 'a-anki', label: 'Anki', kanji: '復' },
  { id: 'a-grammar', label: 'Grammar', kanji: '文' },
  { id: 'a-mining', label: 'Sentence mining', kanji: '採' },
]

export const JP_PASSIVE: ChecklistItem[] = [
  { id: 'p-podcast', label: 'Podcast', kanji: '聴' },
  { id: 'p-anime', label: 'Anime', kanji: '映' },
  { id: 'p-youtube', label: 'YouTube', kanji: '観' },
]

export interface ProgWeek {
  id: string
  week: number
  topic: string
  kanji: string
}

export const PROG_WEEKS: ProgWeek[] = [
  { id: 'w1', week: 1, topic: 'Variables', kanji: '変' },
  { id: 'w2', week: 2, topic: 'Conditionals', kanji: '条' },
  { id: 'w3', week: 3, topic: 'Loops', kanji: '繰' },
  { id: 'w4', week: 4, topic: 'Functions', kanji: '関' },
  { id: 'w5', week: 5, topic: 'Arrays', kanji: '列' },
  { id: 'w6', week: 6, topic: 'Objects', kanji: '物' },
  { id: 'w7', week: 7, topic: 'Recursion Basics', kanji: '帰' },
  { id: 'w8', week: 8, topic: 'Debugging', kanji: '修' },
]

export const PROG_LOOP = [
  'Learn',
  'Trace code by hand',
  'Solve Exercism problem',
  'Explain aloud',
  'Build mini-project',
]

export const REVIEW_QUESTIONS = [
  'What did I complete?',
  'What did I miss?',
  'Why?',
  'What should change next week?',
  'Top 3 priorities next week?',
]

export const ANTI_DISTRACTION = {
  track: ['Japanese', 'Programming', 'University'],
  ignore: ['New frameworks', 'AI hype', 'Productivity systems', 'New roadmaps', 'More courses'],
}

export function scoreBand(score: number) {
  if (score >= 90) return { label: 'Excellent', tone: 'success' as const }
  if (score >= 80) return { label: 'Good', tone: 'aoi' as const }
  if (score >= 70) return { label: 'Acceptable', tone: 'gold' as const }
  return { label: 'Fix the system', tone: 'primary' as const }
}

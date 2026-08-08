// ISO week helpers used across Weekly Metrics and Weekly Review.

function startOfISOWeek(date: Date): Date {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7 // Sunday = 7
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1))
  return d
}

export function getISOWeek(date: Date): { year: number; week: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { year: d.getUTCFullYear(), week }
}

// Stable id for a week, e.g. "2026-W28"
export function weekIdFromDate(date: Date): string {
  const { year, week } = getISOWeek(date)
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function currentWeekId(): string {
  return weekIdFromDate(new Date())
}

// Monday date of a given weekId
export function weekStartFromId(weekId: string): Date {
  const [yearStr, weekStr] = weekId.split('-W')
  const year = Number(yearStr)
  const week = Number(weekStr)
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const week1Monday = startOfISOWeek(jan4)
  const monday = new Date(week1Monday)
  monday.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7)
  return monday
}

export function weekRange(weekId: string): { start: Date; end: Date } {
  const start = weekStartFromId(weekId)
  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 6)
  return { start, end }
}

export function shiftWeek(weekId: string, delta: number): string {
  const start = weekStartFromId(weekId)
  start.setUTCDate(start.getUTCDate() + delta * 7)
  return weekIdFromDate(start)
}

export function weekNumber(weekId: string): number {
  return Number(weekId.split('-W')[1])
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatRange(weekId: string): string {
  const { start, end } = weekRange(weekId)
  return `${formatDate(start)} — ${formatDate(end)}`
}

// Generate a list of recent + upcoming week ids for the picker
export function weekOptions(around: string, span = 12): string[] {
  const ids: string[] = []
  for (let i = span; i >= -span; i--) ids.push(shiftWeek(around, -i))
  return ids
}

// Parse "3h", "30min", "1h30" -> minutes
export function durationToMinutes(input: string): number {
  if (!input) return 0
  let total = 0
  const h = input.match(/(\d+(?:\.\d+)?)\s*h/i)
  const m = input.match(/(\d+)\s*m/i)
  if (h) total += parseFloat(h[1]) * 60
  if (m) total += parseInt(m[1], 10)
  if (!h && !m) {
    const n = parseFloat(input)
    if (!Number.isNaN(n)) total += n * 60 // bare number = hours
  }
  return Math.round(total)
}

export function formatMinutes(mins: number): string {
  if (mins <= 0) return '0h'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h && m) return `${h}h ${m}min`
  if (h) return `${h}h`
  return `${m}min`
}

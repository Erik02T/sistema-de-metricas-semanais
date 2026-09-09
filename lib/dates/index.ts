export function todayKey(date = new Date(), timeZone = 'UTC') {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

export function weekKey(dateKey = todayKey()) {
  const date = new Date(`${dateKey}T12:00:00Z`)
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function formatToday(dateKey: string, timeZone = 'UTC') {
  return new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${dateKey}T12:00:00Z`))
}

export function currentContextKey(timeZone = 'UTC') {
  const date = todayKey(new Date(), timeZone)
  return { date, weekId: weekKey(date), timeZone }
}

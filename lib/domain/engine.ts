import type { AdaptiveTask, DailyContext, FocusBlock, Insight, Metric, StudySession, WeeklyGoal } from './types'

export function replanRemainingTasks(tasks: AdaptiveTask[], context: DailyContext, now = new Date()) {
  const open = tasks.filter((task) => !['completed', 'skipped'].includes(task.status))
  const available = Math.max(0, context.availableMinutes - (context.commitmentPressure === 'high' ? 15 : context.commitmentPressure === 'medium' ? 5 : 0))
  return open.map((task, index) => ({ id: task.id, status: index === 0 && task.minimumMinutes <= available ? 'todo' as const : 'backlog' as const, reason: `Replanned at ${now.toISOString()} because daily context changed.` }))
}

export function buildHistoricalInsights(tasks: AdaptiveTask[], blocks: FocusBlock[], sessions: StudySession[], goals: WeeklyGoal[], now = new Date()): Insight[] {
  const completed = blocks.filter((block) => block.status === 'completed' && block.actualMinutes > 0)
  const byDay = completed.reduce<Record<string, number>>((acc, block) => { const day = new Date(`${block.date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }); acc[day] = (acc[day] || 0) + block.actualMinutes; return acc }, {})
  const bestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]
  const durations = completed.map((block) => block.actualMinutes).sort((a, b) => a - b)
  const ideal = durations.length ? durations[Math.floor(durations.length / 2)] : 0
  const areaMinutes = completed.reduce<Record<string, number>>((acc, block) => { const task = tasks.find((item) => item.id === block.taskId); if (task) acc[task.areaId] = (acc[task.areaId] || 0) + block.actualMinutes; return acc }, {})
  const neglected = tasks.map((task) => task.areaId).find((area) => (areaMinutes[area] || 0) < 30)
  const recurring = goals.filter((goal) => goal.progress < 100).sort((a, b) => a.progress - b.progress)[0]
  const significantDays = new Set(completed.map((block) => block.date)).size
  return [
    bestDay && { id: 'best-day', type: 'best-day' as const, title: `Best day: ${bestDay[0]}`, detail: `${bestDay[1]} minutes of completed work.`, value: bestDay[1], generatedAt: now.toISOString() },
    ideal && { id: 'ideal-duration', type: 'ideal-duration' as const, title: `Ideal block: ${ideal} minutes`, detail: 'Median completed block duration.', value: ideal, generatedAt: now.toISOString() },
    neglected && { id: 'neglected-area', type: 'neglected-area' as const, title: `Neglected area: ${neglected}`, detail: 'Less than 30 completed minutes in the current evidence window.', value: areaMinutes[neglected] || 0, generatedAt: now.toISOString() },
    recurring && { id: `recurring-${recurring.id}`, type: 'recurring-goal' as const, title: `Goal needs a smaller outcome: ${recurring.title}`, detail: `${recurring.progress}% complete.`, value: recurring.progress, generatedAt: now.toISOString() },
    { id: 'streak', type: 'streak' as const, title: `${significantDays}-day meaningful progress streak`, detail: 'Days with at least one completed block or session.', value: significantDays, generatedAt: now.toISOString() },
  ].filter(Boolean) as Insight[]
}

export function calculateMeaningfulStreak(blocks: FocusBlock[], sessions: StudySession[]) {
  const days = new Set([...blocks.filter((block) => block.status === 'completed' && block.actualMinutes >= 10).map((block) => block.date), ...sessions.filter((session) => session.status === 'completed' && session.actualMinutes >= 10).map((session) => session.startedAt.slice(0, 10))])
  let streak = 0
  const cursor = new Date()
  while (days.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1) }
  return streak
}

export function buildMetrics(blocks: FocusBlock[], sessions: StudySession[], period: string, recordedAt = new Date().toISOString()): Metric[] {
  const completedBlocks = blocks.filter((block) => block.status === 'completed')
  const completedSessions = sessions.filter((session) => session.status === 'completed')
  return [
    { id: `${period}-minutes`, key: 'completed_minutes', value: completedBlocks.reduce((sum, block) => sum + block.actualMinutes, 0) + completedSessions.reduce((sum, session) => sum + session.actualMinutes, 0), unit: 'minutes', period, source: 'session', recordedAt },
    { id: `${period}-blocks`, key: 'completed_blocks', value: completedBlocks.length, unit: 'count', period, source: 'session', recordedAt },
    { id: `${period}-sessions`, key: 'completed_sessions', value: completedSessions.length, unit: 'count', period, source: 'session', recordedAt },
  ]
}

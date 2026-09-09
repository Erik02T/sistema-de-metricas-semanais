import type { AdaptiveTask, FocusBlock, WeeklyGoal, WeeklyReview } from './types'

export interface WeeklyAnalytics {
  weekId: string
  plannedMinutes: number
  actualMinutes: number
  completedBlocks: number
  totalBlocks: number
  completedTasks: number
  totalTasks: number
  completedGoals: number
  totalGoals: number
  outcomeScore: number
  consistencyScore: number
  executionScore: number
  overallScore: number
  activeDays: number
  averageBlockMinutes: number
  bestDay: string | null
  message: string
}

export function buildWeeklyAnalytics(
  weekId: string,
  tasks: AdaptiveTask[],
  blocks: FocusBlock[],
  goals: WeeklyGoal[],
): WeeklyAnalytics {
  const weekGoals = goals.filter((goal) => goal.weekId === weekId)
  const weekBlocks = blocks.filter((block) => block.date && block.status !== 'cancelled' && block.status !== 'skipped')
  const completedBlocks = weekBlocks.filter((block) => block.status === 'completed')
  const completedTasks = tasks.filter((task) => task.status === 'completed')
  const plannedMinutes = weekGoals.reduce((sum, goal) => sum + goal.targetMinutes, 0) || tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)
  const actualMinutes = completedBlocks.reduce((sum, block) => sum + block.actualMinutes, 0)
  const completedGoals = weekGoals.filter((goal) => goal.status === 'completed').length
  const goalProgress = weekGoals.length ? weekGoals.reduce((sum, goal) => sum + Math.min(100, goal.progress), 0) / weekGoals.length : 0
  const outcomeScore = Math.round(weekGoals.length ? goalProgress : (tasks.length ? (completedTasks.length / tasks.length) * 100 : 0))
  const executionScore = plannedMinutes ? Math.min(100, Math.round((actualMinutes / plannedMinutes) * 100)) : completedBlocks.length ? 100 : 0
  const activeDays = new Set(completedBlocks.map((block) => block.date)).size
  const consistencyScore = Math.min(100, activeDays * 20)
  const overallScore = Math.round(outcomeScore * 0.5 + executionScore * 0.3 + consistencyScore * 0.2)
  const dayTotals = completedBlocks.reduce<Record<string, number>>((days, block) => ({ ...days, [block.date]: (days[block.date] || 0) + block.actualMinutes }), {})
  const bestDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || null
  const message = !weekGoals.length ? 'Add a weekly outcome to score progress against something meaningful.' : overallScore >= 85 ? 'Your outcomes and execution are aligned. Protect the conditions that made this possible.' : overallScore >= 65 ? 'The week has useful evidence. Choose one unfinished outcome to stabilize next.' : 'Reduce the plan and focus on a minimum outcome before adding more work.'
  return { weekId, plannedMinutes, actualMinutes, completedBlocks: completedBlocks.length, totalBlocks: weekBlocks.length, completedTasks: completedTasks.length, totalTasks: tasks.length, completedGoals, totalGoals: weekGoals.length, outcomeScore, consistencyScore, executionScore, overallScore, activeDays, averageBlockMinutes: completedBlocks.length ? Math.round(actualMinutes / completedBlocks.length) : 0, bestDay, message }
}

export function buildReviewPrompt(analytics: WeeklyAnalytics, goals: WeeklyGoal[], tasks: AdaptiveTask[]) {
  const unfinished = goals.filter((goal) => goal.progress < 100).map((goal) => goal.title)
  const completed = tasks.filter((task) => task.status === 'completed').map((task) => task.title)
  return { wins: completed.slice(0, 3), unfinished: unfinished.slice(0, 3), prompt: analytics.overallScore >= 85 ? 'What will you protect next week?' : 'What will you reduce or change so the next result becomes easier to complete?' }
}

export function getWeekIds(currentWeekId: string, count = 6) {
  const match = currentWeekId.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return [currentWeekId]
  const start = new Date(Date.UTC(Number(match[1]), 0, 1 + (Number(match[2]) - 1) * 7))
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start)
    date.setUTCDate(start.getUTCDate() - index * 7)
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
    const week = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + yearStart.getUTCDay() + 1) / 7)
    return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
  })
}

import type { AdaptiveTask, DailyContext, EnergyLevel, Recommendation, Scorecard, WeeklyGoal, Objective, WeekHealth } from './types'

const ENERGY_RANK: Record<EnergyLevel, number> = { low: 1, medium: 2, high: 3 }

export function calculateTaskScore(task: AdaptiveTask, context: DailyContext, today = new Date()) {
  if (task.status === 'completed' || task.status === 'skipped') return -Infinity
  const fit = task.estimatedMinutes <= context.availableMinutes ? 24 : task.minimumMinutes <= context.availableMinutes ? 12 : -25
  const energyFit = ENERGY_RANK[task.energyRequired] <= ENERGY_RANK[context.energy] ? 18 : -18
  const urgency = task.dueDate ? Math.max(0, 20 - Math.ceil((new Date(`${task.dueDate}T12:00:00Z`).getTime() - today.getTime()) / 86400000)) : 0
  const priority = Math.max(0, 20 - task.priority * 4)
  const focusFit = task.estimatedMinutes <= context.focusMinutes ? 10 : 0
  return fit + energyFit + urgency + priority + focusFit
}

export function getRecommendedTasks(tasks: AdaptiveTask[], context: DailyContext): Recommendation[] {
  return tasks
    .map((task) => ({ task, score: calculateTaskScore(task, context), reason: buildReason(task, context), alternativeMinutes: Math.min(task.minimumMinutes, context.availableMinutes), alternativeReason: task.minimumMinutes <= context.availableMinutes ? `Start with the ${task.minimumMinutes}-minute minimum version.` : 'Choose a smaller task that fits your current window.' }))
    .filter((item) => item.score > -Infinity)
    .sort((a, b) => b.score - a.score)
}

function buildReason(task: AdaptiveTask, context: DailyContext) {
  const reasons = []
  if (task.estimatedMinutes <= context.availableMinutes) reasons.push('fits your available time')
  else if (task.minimumMinutes <= context.availableMinutes) reasons.push('has a realistic minimum version')
  if (ENERGY_RANK[task.energyRequired] <= ENERGY_RANK[context.energy]) reasons.push('matches your current energy')
  if (task.priority === 1) reasons.push('is a high-priority action')
  if (task.dueDate) reasons.push('has a deadline attached')
  return reasons.length ? `${reasons[0].charAt(0).toUpperCase()}${reasons[0].slice(1)}${reasons.length > 1 ? ` and ${reasons.slice(1).join(', ')}` : ''}.` : 'It is available as a next action.'
}

export function buildDailyPlan(tasks: AdaptiveTask[], context: DailyContext) {
  return getRecommendedTasks(tasks, context).filter((item) => item.score > 0).slice(0, 3)
}

export function calculateGoalsHealth(goals: WeeklyGoal[], tasks: AdaptiveTask[], objectives: Objective[], weekId: string): WeekHealth {
  const weekGoals = goals.filter((goal) => goal.weekId === weekId)
  const completedGoals = weekGoals.filter((goal) => goal.status === 'completed').length
  const progress = weekGoals.length ? Math.round(weekGoals.reduce((sum, goal) => sum + Math.max(0, Math.min(100, goal.progress)), 0) / weekGoals.length) : 0
  const plannedMinutes = weekGoals.reduce((sum, goal) => sum + goal.targetMinutes, 0)
  const actualMinutes = weekGoals.reduce((sum, goal) => sum + goal.actualMinutes, 0)
  const activeObjectives = objectives.filter((objective) => objective.status === 'active').length
  const openTasks = tasks.filter((task) => task.status !== 'completed' && task.status !== 'skipped').length
  const atRisk = weekGoals.some((goal) => goal.status === 'at-risk')
  const status = !weekGoals.length ? 'ATTENTION' : completedGoals === weekGoals.length ? 'COMPLETED' : atRisk || (progress < 35 && openTasks > activeObjectives) ? 'AT_RISK' : progress >= 65 ? 'ON_TRACK' : 'ATTENTION'
  const message = !weekGoals.length ? 'Define one outcome per priority objective to make the week visible.' : status === 'COMPLETED' ? 'Your planned outcomes are complete. Protect the momentum with a small review.' : status === 'AT_RISK' ? 'Reduce the plan to the smallest outcomes that still matter.' : status === 'ON_TRACK' ? 'Your progress is aligned with the week. Keep the next action small.' : 'You have progress, but one more concrete result would stabilize the week.'
  return { status, label: status === 'ON_TRACK' ? 'On track' : status === 'AT_RISK' ? 'At risk' : status === 'COMPLETED' ? 'Completed' : 'Attention', progress, completedGoals, totalGoals: weekGoals.length, plannedMinutes, actualMinutes, message }
}

export function calculateWeekHealth(scorecard: Scorecard) {
  if (scorecard.overallScore >= 85) return { label: 'On track', tone: 'success' as const }
  if (scorecard.overallScore >= 65) return { label: 'Attention', tone: 'warning' as const }
  return { label: 'At risk', tone: 'danger' as const }
}

import type { AdaptiveTask, AreaId, EnergyLevel } from './types'

const AREA_KEYWORDS: Record<AreaId, string[]> = {
  japanese: ['japanese', 'japan', 'japonês', 'kanji', 'chunk', 'vocabulary', 'listening', 'grammar'],
  programming: ['programming', 'code', 'coding', 'programação', 'bug', 'issue', 'algorithm', 'software'],
  university: ['university', 'college', 'university', 'faculdade', 'assignment', 'course', 'exam'],
}

export interface CapturedTask {
  title: string
  areaId: AreaId
  estimatedMinutes: number
  minimumMinutes: number
  priority: number
  energyRequired: EnergyLevel
  dueDate?: string
  nextAction: string
}

export function parseTaskCapture(input: string): CapturedTask {
  const title = input.replace(/\b\d+\s*(?:min(?:utes?)?|h(?:our)?s?)\b/gi, '').replace(/\s+/g, ' ').trim()
  const durationMatch = input.match(/(\d+)\s*(min(?:utes?)?|h(?:our)?s?)/i)
  const rawValue = durationMatch ? Number(durationMatch[1]) : 30
  const estimatedMinutes = durationMatch?.[2].toLowerCase().startsWith('h') ? rawValue * 60 : rawValue
  const lower = input.toLowerCase()
  const areaId = (Object.entries(AREA_KEYWORDS).find(([, words]) => words.some((word) => lower.includes(word)))?.[0] || 'programming') as AreaId
  const priority = /urgent|today|deadline|asap|urgente|prazo/i.test(input) ? 1 : /important|important|importante/i.test(input) ? 2 : 3
  const energyRequired: EnergyLevel = /research|write|exam|complex|estudar|prova/i.test(input) ? 'high' : estimatedMinutes <= 25 ? 'low' : 'medium'
  return { title: title || input.trim(), areaId, estimatedMinutes, minimumMinutes: Math.max(8, Math.round(estimatedMinutes * 0.35)), priority, energyRequired, nextAction: `Define the first visible step for “${title || input.trim()}”.` }
}

export function createCapturedTask(input: string, objectiveId?: string, weeklyGoalId?: string): AdaptiveTask {
  const parsed = parseTaskCapture(input)
  return { id: `${Date.now()}-task`, ...parsed, description: '', objectiveId, weeklyGoalId, status: 'todo', createdAt: new Date().toISOString() }
}

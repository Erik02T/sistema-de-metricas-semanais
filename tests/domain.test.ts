import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateMeaningfulStreak, replanRemainingTasks, buildHistoricalInsights } from '../lib/domain/engine.ts'
import { withRetry } from '../lib/domain/repository.ts'

const task = { id: 't1', title: 'Study', description: '', areaId: 'japanese' as const, status: 'todo' as const, priority: 1, estimatedMinutes: 30, minimumMinutes: 10, energyRequired: 'low' as const, nextAction: 'Open notes', createdAt: '2026-01-01T00:00:00.000Z' }

test('replans remaining tasks around changed capacity', () => {
  const result = replanRemainingTasks([task], { date: '2026-09-10', weekId: '2026-W37', timezone: 'UTC', availableMinutes: 20, energy: 'medium', focusMinutes: 20, commitmentPressure: 'medium', commitments: 'meeting' })
  assert.equal(result[0].status, 'todo')
  assert.match(result[0].reason, /daily context changed/)
})

test('counts meaningful streak from completed blocks', () => {
  const today = new Date().toISOString().slice(0, 10)
  assert.equal(calculateMeaningfulStreak([{ id: 'b', date: today, taskId: 't1', plannedMinutes: 15, actualMinutes: 15, energyBefore: 'low', status: 'completed', result: 'done', createdAt: new Date().toISOString() }], []), 1)
})

test('derives historical insights from completed evidence', () => {
  const insights = buildHistoricalInsights([task], [{ id: 'b', date: '2026-09-10', taskId: 't1', plannedMinutes: 30, actualMinutes: 30, energyBefore: 'low', status: 'completed', result: 'done', createdAt: new Date().toISOString() }], [], [], new Date('2026-09-10T12:00:00Z'))
  assert.ok(insights.some((insight) => insight.type === 'best-day'))
  assert.ok(insights.some((insight) => insight.type === 'ideal-duration'))
})

test('retries repository operations and reports success', async () => {
  let attempts = 0
  const value = await withRetry(async () => { attempts += 1; if (attempts < 2) throw new Error('temporary'); return 'ok' }, 2)
  assert.equal(value, 'ok')
  assert.equal(attempts, 2)
})

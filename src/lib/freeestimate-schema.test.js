import { describe, expect, test } from 'bun:test'
import { choicesAreValid, freeEstimateSchema, FREE_ESTIMATE_RECIPIENTS, PROJECT_OPTIONS } from './freeestimate-schema'

const valid = {
  submissionId: 'cd21dbfa-2b67-4385-a5cc-bcfa8b9bc7a7', desiredUpgrade: PROJECT_OPTIONS[0],
  mainProblem: 'Hard to step over', timeframe: 'ASAP', name: 'Test Visitor',
  email: 'visitor@example.com', phone: '2105550199', address: '123 Test Street', homeowner: 'Yes',
}
describe('Free estimate requirements', () => {
  for (const field of ['desiredUpgrade', 'mainProblem', 'timeframe', 'name', 'email', 'phone', 'address', 'homeowner']) {
    test(`${field} is required`, () => { expect(freeEstimateSchema.safeParse({ ...valid, [field]: '' }).success).toBe(false) })
  }
  test('both homeowner choices are accepted', () => {
    expect(freeEstimateSchema.safeParse(valid).success).toBe(true)
    expect(freeEstimateSchema.safeParse({ ...valid, homeowner: 'No' }).success).toBe(true)
  })
  test('only saved problem and timing choices can be submitted', () => {
    const parsed = freeEstimateSchema.parse(valid)
    expect(choicesAreValid(parsed, ['Hard to step over'], ['ASAP'])).toBe(true)
    expect(choicesAreValid({ ...parsed, mainProblem: 'invented' }, ['Hard to step over'], ['ASAP'])).toBe(false)
    expect(choicesAreValid({ ...parsed, timeframe: 'invented' }, ['Hard to step over'], ['ASAP'])).toBe(false)
  })
  test('notifications go only to Justin and Josiah', () => {
    expect([...FREE_ESTIMATE_RECIPIENTS]).toEqual(['justin@texasbathsolutions.com', 'josiah@texasbathsolutions.com'])
  })
})
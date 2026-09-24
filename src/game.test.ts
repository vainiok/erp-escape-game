import { describe, expect, it } from 'vitest'
import { getResult, getRiskCount } from './game'

describe('ERP game scoring', () => {
  it('returns red when the legacy ERP answer is yes', () => {
    expect(getResult([0, 0, 0, 0, 1, 0, 0, 0]).tone).toBe('red')
  })

  it('returns red with four risk answers even without legacy ERP', () => {
    expect(getResult([1, 1, 1, 0, 0, 0, 1, 0]).tone).toBe('red')
  })

  it('returns yellow with exactly three risk answers', () => {
    expect(getResult([1, 1, 0, 0, 0, 0, 1, 0]).tone).toBe('yellow')
  })

  it('still returns red with only two other risks when the legacy ERP answer is yes', () => {
    expect(getResult([1, 0, 0, 0, 1, 0, 1, 0]).tone).toBe('red')
  })

  it('returns green with at most two risk answers', () => {
    expect(getResult([0, 0, 0, 0, 0, 1, 0, 1]).tone).toBe('green')
  })

  it('counts Yli 100 as a risk answer', () => {
    expect(getRiskCount([0, 0, 0, 0, 0, 0, 1, 0])).toBe(1)
  })
})

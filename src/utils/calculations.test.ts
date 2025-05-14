import { describe, it, expect } from 'vitest';
import {
  calculatePeriodStart,
  calculateSpending,
  calculateRemainingBudget,
  calculateUsagePercentage,
  getColorForPercentage,
} from './calculations';

describe('calculatePeriodStart', () => {
  it('calculates daily period start', () => {
    const date = new Date('2024-03-15T14:30:00');
    const result = calculatePeriodStart(date, 'daily');
    expect(result.toISOString()).toBe('2024-03-15T00:00:00.000Z');
  });

  it('calculates weekly period start', () => {
    const date = new Date('2024-03-15T14:30:00'); // Friday
    const result = calculatePeriodStart(date, 'weekly');
    expect(result.toISOString()).toBe('2024-03-10T00:00:00.000Z'); // Should be Sunday
  });

  it('calculates monthly period start', () => {
    const date = new Date('2024-03-15T14:30:00');
    const result = calculatePeriodStart(date, 'monthly');
    expect(result.toISOString()).toBe('2024-03-01T00:00:00.000Z');
  });

  it('calculates yearly period start', () => {
    const date = new Date('2024-03-15T14:30:00');
    const result = calculatePeriodStart(date, 'yearly');
    expect(result.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('throws error for invalid period', () => {
    const date = new Date();
    expect(() => calculatePeriodStart(date, 'invalid')).toThrow('Invalid period: invalid');
  });
});

describe('calculateSpending', () => {
  it('calculates total spending from events', () => {
    const events = [
      { amount: 100, enabled: true },
      { amount: 200, enabled: true },
      { amount: 300, enabled: true },
    ];
    expect(calculateSpending(events)).toBe(600);
  });

  it('excludes disabled events from spending calculation', () => {
    const events = [
      { amount: 100, enabled: true },
      { amount: 200, enabled: false },
      { amount: 300, enabled: true },
    ];
    expect(calculateSpending(events)).toBe(400);
  });

  it('treats events without enabled flag as enabled', () => {
    const events = [
      { amount: 100 },
      { amount: 200, enabled: false },
      { amount: 300 },
    ];
    expect(calculateSpending(events)).toBe(400);
  });

  it('returns 0 for empty events array', () => {
    expect(calculateSpending([])).toBe(0);
  });
});

describe('calculateRemainingBudget', () => {
  it('calculates remaining budget', () => {
    expect(calculateRemainingBudget(1000, 600)).toBe(400);
  });

  it('returns negative for overspending', () => {
    expect(calculateRemainingBudget(1000, 1200)).toBe(-200);
  });
});

describe('calculateUsagePercentage', () => {
  it('calculates usage percentage', () => {
    expect(calculateUsagePercentage(600, 1000)).toBe(60);
  });

  it('handles overspending', () => {
    expect(calculateUsagePercentage(1200, 1000)).toBe(120);
  });

  it('handles zero spending', () => {
    expect(calculateUsagePercentage(0, 1000)).toBe(0);
  });
});

describe('getColorForPercentage', () => {
  it('returns green for low usage', () => {
    expect(getColorForPercentage(50)).toBe('green');
  });

  it('returns yellow for medium usage', () => {
    expect(getColorForPercentage(80)).toBe('yellow');
  });

  it('returns red for high usage', () => {
    expect(getColorForPercentage(95)).toBe('red');
  });
});

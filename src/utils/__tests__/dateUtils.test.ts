import { describe, expect, it } from 'bun:test';
import {
  toDateString,
  getDateRangeForPeriod,
  isDateInRange,
  formatPeriodLabel,
} from '../dateUtils';

describe('dateUtils', () => {
  it('converts date to YYYY-MM-DD string', () => {
    const d = new Date(2026, 9, 19); // month index 9 is October
    expect(toDateString(d)).toBe('2026-10-19');
  });

  it('calculates date range for today', () => {
    const range = getDateRangeForPeriod('today');
    expect(range.startDate).toBe(range.endDate);
  });

  it('checks if date is in range', () => {
    const range = { startDate: '2026-10-01', endDate: '2026-10-31' };
    expect(isDateInRange('2026-10-15T12:00:00Z', range)).toBe(true);
    expect(isDateInRange('2026-10-01', range)).toBe(true);
    expect(isDateInRange('2026-10-31', range)).toBe(true);
    expect(isDateInRange('2026-09-30', range)).toBe(false);
    expect(isDateInRange('2026-11-01', range)).toBe(false);
  });

  it('formats custom period label', () => {
    const label = formatPeriodLabel('custom', {
      startDate: '2026-10-01',
      endDate: '2026-10-15',
    });
    expect(label).toContain('Okt 2026');
  });
});

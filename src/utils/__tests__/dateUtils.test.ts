import { describe, expect, it } from 'bun:test';
import {
  toDateString,
  getDateRangeForPeriod,
  isDateInRange,
  formatPeriodLabel,
  groupTransactionsByDate,
} from '../dateUtils';
import { Transaction } from '../../types';

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

  it('groups transactions by date with friendly Indonesian date headers', () => {
    const txs: Transaction[] = [
      {
        id: 'tx-1',
        type: 'expense',
        amount: 25000,
        walletId: 'w-1',
        categoryId: 'cat-food',
        date: '2026-10-12T09:30:00.000Z',
        createdAt: '2026-10-12T09:30:00.000Z',
      },
      {
        id: 'tx-2',
        type: 'income',
        amount: 100000,
        walletId: 'w-1',
        categoryId: 'cat-salary',
        date: '2026-10-12T14:15:00.000Z',
        createdAt: '2026-10-12T14:15:00.000Z',
      },
      {
        id: 'tx-3',
        type: 'expense',
        amount: 15000,
        walletId: 'w-1',
        categoryId: 'cat-transport',
        date: '2026-10-11T08:00:00.000Z',
        createdAt: '2026-10-11T08:00:00.000Z',
      },
    ];

    const groups = groupTransactionsByDate(txs);
    expect(groups.length).toBe(2);
    expect(groups[0].date).toBe('2026-10-12');
    expect(groups[0].title).toContain('Senin, 12 Oktober 2026');
    expect(groups[0].transactions.length).toBe(2);
    expect(groups[0].totalExpense).toBe(25000);
    expect(groups[0].totalIncome).toBe(100000);

    expect(groups[1].date).toBe('2026-10-11');
    expect(groups[1].title).toContain('Minggu, 11 Oktober 2026');
    expect(groups[1].transactions.length).toBe(1);
    expect(groups[1].totalExpense).toBe(15000);
  });
});


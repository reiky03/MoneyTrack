import { describe, expect, it } from 'bun:test';
import {
  calculateTotalBalance,
  calculateCashflow,
  calculateCategorySummaries,
  recomputeWalletBalances,
} from '../calculations';
import { Wallet, Transaction, Category } from '../../types';

describe('calculations', () => {
  const sampleWallets: Wallet[] = [
    {
      id: 'w1',
      name: 'BCA',
      type: 'bank',
      balance: 1000000,
      initialBalance: 1000000,
      color: '#3B82F6',
      icon: 'card',
      createdAt: '',
    },
    {
      id: 'w2',
      name: 'Cash',
      type: 'cash',
      balance: 500000,
      initialBalance: 500000,
      color: '#10B981',
      icon: 'wallet',
      createdAt: '',
    },
  ];

  const sampleCategories: Category[] = [
    {
      id: 'c1',
      name: 'Pendidikan',
      type: 'expense',
      color: '#6366F1',
      icon: 'school',
      createdAt: '',
    },
    {
      id: 'c2',
      name: 'Belanja',
      type: 'expense',
      color: '#10B981',
      icon: 'cart',
      createdAt: '',
    },
    {
      id: 'c3',
      name: 'Gaji',
      type: 'income',
      color: '#10B981',
      icon: 'briefcase',
      createdAt: '',
    },
  ];

  it('calculates total balance accurately', () => {
    expect(calculateTotalBalance(sampleWallets)).toBe(1500000);
  });

  it('calculates cashflow for income and expense', () => {
    const txs: Transaction[] = [
      {
        id: '1',
        type: 'income',
        amount: 2000000,
        walletId: 'w1',
        date: '2026-10-01',
        createdAt: '',
      },
      {
        id: '2',
        type: 'expense',
        amount: 300000,
        walletId: 'w1',
        date: '2026-10-02',
        createdAt: '',
      },
      {
        id: '3',
        type: 'expense',
        amount: 200000,
        walletId: 'w2',
        date: '2026-10-03',
        createdAt: '',
      },
    ];

    const result = calculateCashflow(txs);
    expect(result.income).toBe(2000000);
    expect(result.expense).toBe(500000);
    expect(result.net).toBe(1500000);
  });

  it('calculates category summaries with percentages', () => {
    const txs: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 300000,
        categoryId: 'c1', // Pendidikan
        walletId: 'w1',
        date: '2026-10-02',
        createdAt: '',
      },
      {
        id: '2',
        type: 'expense',
        amount: 100000,
        categoryId: 'c2', // Belanja
        walletId: 'w1',
        date: '2026-10-03',
        createdAt: '',
      },
    ];

    const summaries = calculateCategorySummaries(txs, sampleCategories, 'expense');
    expect(summaries.length).toBe(2);
    expect(summaries[0].categoryName).toBe('Pendidikan');
    expect(summaries[0].totalAmount).toBe(300000);
    expect(summaries[0].percentage).toBe(75);

    expect(summaries[1].categoryName).toBe('Belanja');
    expect(summaries[1].totalAmount).toBe(100000);
    expect(summaries[1].percentage).toBe(25);
  });

  it('recomputes wallet balances with expenses, incomes, and transfers', () => {
    const txs: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 200000,
        walletId: 'w1',
        date: '2026-10-01',
        createdAt: '',
      },
      {
        id: '2',
        type: 'income',
        amount: 500000,
        walletId: 'w2',
        date: '2026-10-02',
        createdAt: '',
      },
      {
        id: '3',
        type: 'transfer',
        amount: 300000,
        walletId: 'w1', // from w1
        toWalletId: 'w2', // to w2
        date: '2026-10-03',
        createdAt: '',
      },
    ];

    const updated = recomputeWalletBalances(sampleWallets, txs);
    // w1: initial 1000000 - 200000 - 300000 = 500000
    // w2: initial 500000 + 500000 + 300000 = 1300000
    expect(updated.find((w) => w.id === 'w1')?.balance).toBe(500000);
    expect(updated.find((w) => w.id === 'w2')?.balance).toBe(1300000);
  });
});

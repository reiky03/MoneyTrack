import { describe, test, expect } from 'bun:test';
import {
  calculateTotalBalance,
  calculateCashflow,
  calculateCategorySummaries,
  recomputeWalletBalances,
  filterTransactionsByPeriod,
} from '../utils/calculations';
import { DEFAULT_WALLETS } from '../constants/defaultWallets';
import { DEFAULT_CATEGORIES } from '../constants/defaultCategories';
import { Wallet, Transaction, Category } from '../types';

describe('MoneyTrack Full Feature Test Suite', () => {
  // Test 1: Clean Slate Initial State
  test('Clean Slate: Default wallets have 0 balance and 0 demo transactions', () => {
    expect(DEFAULT_WALLETS.length).toBeGreaterThan(0);
    for (const wallet of DEFAULT_WALLETS) {
      expect(wallet.balance).toBe(0);
      expect(wallet.initialBalance).toBe(0);
    }

    const total = calculateTotalBalance(DEFAULT_WALLETS);
    expect(total).toBe(0);

    const emptyCashflow = calculateCashflow([]);
    expect(emptyCashflow.income).toBe(0);
    expect(emptyCashflow.expense).toBe(0);
    expect(emptyCashflow.net).toBe(0);
  });

  // Test 2: Wallet Management (Add, Edit, Balance Adjustment, Delete)
  test('Wallet CRUD & Balance Adjustment', () => {
    let wallets: Wallet[] = [...DEFAULT_WALLETS];

    // Add a new wallet (e.g. Bank Mandiri)
    const newWallet: Wallet = {
      id: 'wallet-mandiri',
      name: 'Bank Mandiri',
      type: 'bank',
      balance: 1000000,
      initialBalance: 1000000,
      color: '#0284C7',
      icon: 'card',
      createdAt: new Date().toISOString(),
    };
    wallets.push(newWallet);
    expect(wallets.length).toBe(4);
    expect(calculateTotalBalance(wallets)).toBe(1000000);

    // Adjust balance directly (e.g. user corrects saldo to 2,500,000)
    wallets = wallets.map((w) =>
      w.id === 'wallet-mandiri'
        ? { ...w, balance: 2500000, initialBalance: 2500000 }
        : w
    );
    expect(calculateTotalBalance(wallets)).toBe(2500000);

    // Delete a wallet
    wallets = wallets.filter((w) => w.id !== 'wallet-mandiri');
    expect(wallets.length).toBe(3);
    expect(calculateTotalBalance(wallets)).toBe(0);
  });

  // Test 3: Transaction CRUD (Income, Expense, Transfer)
  test('Transaction Flows & Balance Recomputation', () => {
    const wallets: Wallet[] = [
      {
        id: 'w-bank',
        name: 'Bank BCA',
        type: 'bank',
        balance: 5000000,
        initialBalance: 5000000,
        color: '#3B82F6',
        icon: 'card',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'w-cash',
        name: 'Uang Tunai',
        type: 'cash',
        balance: 500000,
        initialBalance: 500000,
        color: '#10B981',
        icon: 'wallet',
        createdAt: new Date().toISOString(),
      },
    ];

    let txs: Transaction[] = [];

    // 1. Income: Gaji masuk Rp 10.000.000 ke Bank BCA
    const tx1: Transaction = {
      id: 'tx-1',
      type: 'income',
      amount: 10000000,
      walletId: 'w-bank',
      categoryId: 'cat-gaji',
      date: new Date().toISOString(),
      note: 'Gaji Masuk',
      createdAt: new Date().toISOString(),
    };
    txs.push(tx1);

    let recomputed = recomputeWalletBalances(wallets, txs);
    expect(recomputed.find((w) => w.id === 'w-bank')?.balance).toBe(15000000);
    expect(calculateTotalBalance(recomputed)).toBe(15500000);

    // 2. Expense: Belanja Rp 200.000 tunai
    const tx2: Transaction = {
      id: 'tx-2',
      type: 'expense',
      amount: 200000,
      walletId: 'w-cash',
      categoryId: 'cat-belanja',
      date: new Date().toISOString(),
      note: 'Belanja sayur & buah',
      createdAt: new Date().toISOString(),
    };
    txs.push(tx2);

    recomputed = recomputeWalletBalances(wallets, txs);
    expect(recomputed.find((w) => w.id === 'w-cash')?.balance).toBe(300000);
    expect(calculateTotalBalance(recomputed)).toBe(15300000);

    // 3. Transfer: Tarik tunai Rp 1.000.000 dari BCA ke Tunai
    const tx3: Transaction = {
      id: 'tx-3',
      type: 'transfer',
      amount: 1000000,
      walletId: 'w-bank',
      toWalletId: 'w-cash',
      date: new Date().toISOString(),
      note: 'Tarik tunai ATM',
      createdAt: new Date().toISOString(),
    };
    txs.push(tx3);

    recomputed = recomputeWalletBalances(wallets, txs);
    expect(recomputed.find((w) => w.id === 'w-bank')?.balance).toBe(14000000);
    expect(recomputed.find((w) => w.id === 'w-cash')?.balance).toBe(1300000);
    // Net total remains unchanged by transfers
    expect(calculateTotalBalance(recomputed)).toBe(15300000);

    // Check cashflow summary (transfer does not affect cashflow)
    const cashflow = calculateCashflow(txs);
    expect(cashflow.income).toBe(10000000);
    expect(cashflow.expense).toBe(200000);
    expect(cashflow.net).toBe(9800000);

    // 4. Edit Transaction: ubah belanja dari 200.000 menjadi 250.000
    txs = txs.map((tx) => (tx.id === 'tx-2' ? { ...tx, amount: 250000 } : tx));
    recomputed = recomputeWalletBalances(wallets, txs);
    expect(recomputed.find((w) => w.id === 'w-cash')?.balance).toBe(1250000);
    expect(calculateTotalBalance(recomputed)).toBe(15250000);

    // 5. Delete Transaction: hapus tx-2
    txs = txs.filter((tx) => tx.id !== 'tx-2');
    recomputed = recomputeWalletBalances(wallets, txs);
    expect(recomputed.find((w) => w.id === 'w-cash')?.balance).toBe(1500000);
    expect(calculateCashflow(txs).expense).toBe(0);
  });

  // Test 4: Filtering Logic (3-Segment Type, Wallet Filter, Search Query)
  test('Transaction Filtering Logic', () => {
    const txs: Transaction[] = [
      {
        id: 't-1',
        type: 'income',
        amount: 5000000,
        walletId: 'w-1',
        categoryId: 'cat-gaji',
        date: '2026-10-15T10:00:00.000Z',
        note: 'Gaji utama',
        createdAt: '2026-10-15T10:00:00.000Z',
      },
      {
        id: 't-2',
        type: 'expense',
        amount: 50000,
        walletId: 'w-1',
        categoryId: 'cat-makanan',
        date: '2026-10-16T12:00:00.000Z',
        note: 'Makan siang nasi padang',
        createdAt: '2026-10-16T12:00:00.000Z',
      },
      {
        id: 't-3',
        type: 'expense',
        amount: 120000,
        walletId: 'w-2',
        categoryId: 'cat-transport',
        date: '2026-10-17T08:00:00.000Z',
        note: 'Bensin motor',
        createdAt: '2026-10-17T08:00:00.000Z',
      },
      {
        id: 't-4',
        type: 'transfer',
        amount: 200000,
        walletId: 'w-1',
        toWalletId: 'w-2',
        date: '2026-10-18T14:00:00.000Z',
        note: 'Top up dompet',
        createdAt: '2026-10-18T14:00:00.000Z',
      },
    ];

    // Filter by Type: Semua
    expect(txs.length).toBe(4);

    // Filter by Type: Keluar (expense)
    const expenses = txs.filter((t) => t.type === 'expense');
    expect(expenses.length).toBe(2);

    // Filter by Type: Masuk (income)
    const incomes = txs.filter((t) => t.type === 'income');
    expect(incomes.length).toBe(1);

    // Filter by Wallet: w-2 (includes transactions where walletId or toWalletId is w-2)
    const w2Transactions = txs.filter((t) => t.walletId === 'w-2' || t.toWalletId === 'w-2');
    expect(w2Transactions.length).toBe(2); // t-3 (expense) and t-4 (transfer target)

    // Filter by Search Query: "padang"
    const searchPadang = txs.filter((t) => t.note?.toLowerCase().includes('padang'));
    expect(searchPadang.length).toBe(1);
    expect(searchPadang[0].id).toBe('t-2');
  });

  // Test 5: Category Summaries for Charts
  test('Category Summaries with clean empty checks', () => {
    const emptySummaries = calculateCategorySummaries([], DEFAULT_CATEGORIES, 'expense');
    expect(emptySummaries.length).toBe(0);

    const testTxs: Transaction[] = [
      {
        id: 'tx-a',
        type: 'expense',
        amount: 300000,
        walletId: 'w-1',
        categoryId: 'cat-makanan',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'tx-b',
        type: 'expense',
        amount: 700000,
        walletId: 'w-1',
        categoryId: 'cat-belanja',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ];

    const summaries = calculateCategorySummaries(testTxs, DEFAULT_CATEGORIES, 'expense');
    expect(summaries.length).toBe(2);
    // Belanja (700rb out of 1jt = 70%)
    const belanja = summaries.find((s) => s.categoryId === 'cat-belanja');
    expect(belanja?.totalAmount).toBe(700000);
    expect(belanja?.percentage).toBe(70);

    // Makanan (300rb out of 1jt = 30%)
    const makanan = summaries.find((s) => s.categoryId === 'cat-makanan');
    expect(makanan?.totalAmount).toBe(300000);
    expect(makanan?.percentage).toBe(30);
  });
});

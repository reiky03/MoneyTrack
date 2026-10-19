import {
  Wallet,
  Transaction,
  Category,
  DateRange,
  CategorySummary,
  DailySummary,
} from '../types';
import { isDateInRange, parseLocalDate } from './dateUtils';

/**
 * Calculates sum of all wallet balances
 */
export function calculateTotalBalance(wallets: Wallet[]): number {
  return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
}

/**
 * Filters transactions that fall within the given date range
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  range: DateRange
): Transaction[] {
  return transactions.filter((tx) => isDateInRange(tx.date, range));
}

/**
 * Calculates total income, expense, and net cashflow for a list of transactions
 */
export function calculateCashflow(transactions: Transaction[]): {
  income: number;
  expense: number;
  net: number;
} {
  let income = 0;
  let expense = 0;

  for (const tx of transactions) {
    if (tx.type === 'income') {
      income += tx.amount;
    } else if (tx.type === 'expense') {
      expense += tx.amount;
    }
  }

  return {
    income,
    expense,
    net: income - expense,
  };
}

/**
 * Groups and aggregates transactions by category
 */
export function calculateCategorySummaries(
  transactions: Transaction[],
  categories: Category[],
  type: 'expense' | 'income'
): CategorySummary[] {
  const filtered = transactions.filter((tx) => tx.type === type);
  const totalAmount = filtered.reduce((sum, tx) => sum + tx.amount, 0);

  const categoryMap = new Map<string, { total: number; count: number }>();

  for (const tx of filtered) {
    const catId = tx.categoryId || 'cat-unknown';
    const current = categoryMap.get(catId) || { total: 0, count: 0 };
    current.total += tx.amount;
    current.count += 1;
    categoryMap.set(catId, current);
  }

  const summaries: CategorySummary[] = [];

  categoryMap.forEach((data, catId) => {
    const category = categories.find((c) => c.id === catId) || {
      id: catId,
      name: 'Lainnya',
      color: '#64748B',
      icon: 'pricetag',
      type,
      createdAt: '',
    };

    const percentage = totalAmount > 0 ? (data.total / totalAmount) * 100 : 0;

    summaries.push({
      categoryId: catId,
      categoryName: category.name,
      color: category.color,
      icon: category.icon,
      totalAmount: data.total,
      percentage,
      transactionCount: data.count,
    });
  });

  // Sort descending by amount
  return summaries.sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Prepares aggregated data for bar/area charts.
 * Automatically selects daily, weekly, or monthly grouping based on the range length.
 */
export function calculateChartSummaries(
  transactions: Transaction[],
  range: DateRange
): DailySummary[] {
  const start = parseLocalDate(range.startDate);
  const end = parseLocalDate(range.endDate);
  const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  const map = new Map<string, { label: string; income: number; expense: number }>();

  if (diffDays <= 1) {
    // Single day: breakdown by hours or show single bar
    const key = range.startDate;
    map.set(key, { label: 'Hari ini', income: 0, expense: 0 });
    for (const tx of transactions) {
      if (tx.date.slice(0, 10) === key) {
        const item = map.get(key)!;
        if (tx.type === 'income') item.income += tx.amount;
        if (tx.type === 'expense') item.expense += tx.amount;
      }
    }
  } else if (diffDays <= 14) {
    // Daily intervals
    const curr = new Date(start);
    for (let i = 0; i < diffDays; i++) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;
      const label = `${curr.getDate()}/${curr.getMonth() + 1}`;
      map.set(key, { label, income: 0, expense: 0 });
      curr.setDate(curr.getDate() + 1);
    }

    for (const tx of transactions) {
      const txKey = tx.date.slice(0, 10);
      const item = map.get(txKey);
      if (item) {
        if (tx.type === 'income') item.income += tx.amount;
        if (tx.type === 'expense') item.expense += tx.amount;
      }
    }
  } else if (diffDays <= 60) {
    // Group by ~4-5 buckets (e.g. weeks)
    const numBuckets = Math.min(6, Math.ceil(diffDays / 7));
    const bucketDays = Math.ceil(diffDays / numBuckets);

    for (let i = 0; i < numBuckets; i++) {
      const bStart = new Date(start);
      bStart.setDate(start.getDate() + i * bucketDays);
      const bEnd = new Date(start);
      bEnd.setDate(Math.min(end.getDate(), start.getDate() + (i + 1) * bucketDays - 1));
      const key = `w-${i}`;
      const label = `Mgg ${i + 1}`;
      map.set(key, { label, income: 0, expense: 0 });
    }

    for (const tx of transactions) {
      const txDate = parseLocalDate(tx.date);
      const dayIndex = Math.floor((txDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const bucketIdx = Math.min(numBuckets - 1, Math.max(0, Math.floor(dayIndex / bucketDays)));
      const item = map.get(`w-${bucketIdx}`);
      if (item) {
        if (tx.type === 'income') item.income += tx.amount;
        if (tx.type === 'expense') item.expense += tx.amount;
      }
    }
  } else {
    // Group by month
    const curr = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    while (curr <= endMonth) {
      const key = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}`;
      const label = `${monthNames[curr.getMonth()]} ${String(curr.getFullYear()).slice(2)}`;
      map.set(key, { label, income: 0, expense: 0 });
      curr.setMonth(curr.getMonth() + 1);
    }

    for (const tx of transactions) {
      const txKey = tx.date.slice(0, 7);
      const item = map.get(txKey);
      if (item) {
        if (tx.type === 'income') item.income += tx.amount;
        if (tx.type === 'expense') item.expense += tx.amount;
      }
    }
  }

  const result: DailySummary[] = [];
  map.forEach((val, key) => {
    result.push({
      date: key,
      label: val.label,
      income: val.income,
      expense: val.expense,
    });
  });

  return result;
}

/**
 * Recomputes live wallet balances based on their initial balances and transaction history
 */
export function recomputeWalletBalances(
  wallets: Wallet[],
  transactions: Transaction[]
): Wallet[] {
  return wallets.map((wallet) => {
    let currentBalance = wallet.initialBalance;

    for (const tx of transactions) {
      if (tx.type === 'expense' && tx.walletId === wallet.id) {
        currentBalance -= tx.amount;
      } else if (tx.type === 'income' && tx.walletId === wallet.id) {
        currentBalance += tx.amount;
      } else if (tx.type === 'transfer') {
        if (tx.walletId === wallet.id) {
          currentBalance -= tx.amount;
        }
        if (tx.toWalletId === wallet.id) {
          currentBalance += tx.amount;
        }
      }
    }

    return {
      ...wallet,
      balance: currentBalance,
    };
  });
}

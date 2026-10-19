export type TransactionType = 'expense' | 'income' | 'transfer';

export type WalletType = 'bank' | 'cash' | 'ewallet' | 'investment' | 'other';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  initialBalance: number;
  color: string;
  icon: string;
  accountNumber?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  icon: string;
  isSystem?: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  walletId: string;
  toWalletId?: string; // used when type === 'transfer'
  categoryId?: string; // used when type === 'expense' | 'income'
  date: string; // ISO 8601 string
  note?: string;
  createdAt: string;
}

export type PeriodType = 'today' | 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'custom';

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface PeriodFilterState {
  type: PeriodType;
  range: DateRange;
  label: string;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  color: string;
  icon: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

export interface DailySummary {
  date: string;
  label: string;
  income: number;
  expense: number;
}

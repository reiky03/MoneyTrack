import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import {
  Wallet,
  Category,
  Transaction,
  PeriodType,
  DateRange,
  PeriodFilterState,
  CategorySummary,
  DailySummary,
} from '../types';
import { StorageService } from '../services/storageService';
import {
  getDateRangeForPeriod,
  formatPeriodLabel,
} from '../utils/dateUtils';
import {
  calculateTotalBalance,
  filterTransactionsByPeriod,
  calculateCashflow,
  calculateCategorySummaries,
  calculateChartSummaries,
  recomputeWalletBalances,
} from '../utils/calculations';

interface MoneyContextType {
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  isPrivacyMode: boolean;
  isLoading: boolean;
  periodState: PeriodFilterState;
  selectedWalletId: string | null;

  // Computed analytics
  totalBalance: number;
  cashflow: { income: number; expense: number; net: number };
  expenseCategorySummaries: CategorySummary[];
  incomeCategorySummaries: CategorySummary[];
  chartSummaries: DailySummary[];

  // Actions
  togglePrivacyMode: () => void;
  setPeriod: (type: PeriodType, customRange?: DateRange) => void;
  setSelectedWalletId: (id: string | null) => void;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addWallet: (data: Omit<Wallet, 'id' | 'createdAt' | 'balance'>) => Promise<void>;
  updateWallet: (wallet: Wallet) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  addCategory: (data: Omit<Category, 'id' | 'createdAt'>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const MoneyContext = createContext<MoneyContextType | undefined>(undefined);

export const MoneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  // Period state defaults to 'this_month'
  const [periodState, setPeriodState] = useState<PeriodFilterState>(() => {
    const range = getDateRangeForPeriod('this_month');
    return {
      type: 'this_month',
      range,
      label: formatPeriodLabel('this_month', range),
    };
  });

  // Load persisted data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const stored = await StorageService.initialize();
        const privacy = await StorageService.getPrivacyMode();

        // Calculate up-to-date balances
        const recomputed = recomputeWalletBalances(stored.wallets, stored.transactions);

        setWallets(recomputed);
        setCategories(stored.categories);
        setTransactions(stored.transactions);
        setIsPrivacyMode(privacy);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const triggerHaptic = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fail silently on web or unsupported devices
    }
  }, []);

  const togglePrivacyMode = useCallback(() => {
    triggerHaptic();
    setIsPrivacyMode((prev) => {
      const next = !prev;
      StorageService.savePrivacyMode(next);
      return next;
    });
  }, [triggerHaptic]);

  const setPeriod = useCallback((type: PeriodType, customRange?: DateRange) => {
    triggerHaptic();
    const range = getDateRangeForPeriod(type, customRange);
    setPeriodState({
      type,
      range,
      label: formatPeriodLabel(type, range),
    });
  }, [triggerHaptic]);

  // Add transaction
  const addTransaction = useCallback(
    async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
      triggerHaptic();
      const newTx: Transaction = {
        ...data,
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
      };

      const nextTxs = [newTx, ...transactions];
      const nextWallets = recomputeWalletBalances(wallets, nextTxs);

      setTransactions(nextTxs);
      setWallets(nextWallets);

      await Promise.all([
        StorageService.saveTransactions(nextTxs),
        StorageService.saveWallets(nextWallets),
      ]);
    },
    [transactions, wallets, triggerHaptic]
  );

  // Delete transaction
  const deleteTransaction = useCallback(
    async (id: string) => {
      triggerHaptic();
      const nextTxs = transactions.filter((tx) => tx.id !== id);
      const nextWallets = recomputeWalletBalances(wallets, nextTxs);

      setTransactions(nextTxs);
      setWallets(nextWallets);

      await Promise.all([
        StorageService.saveTransactions(nextTxs),
        StorageService.saveWallets(nextWallets),
      ]);
    },
    [transactions, wallets, triggerHaptic]
  );

  // Add wallet
  const addWallet = useCallback(
    async (data: Omit<Wallet, 'id' | 'createdAt' | 'balance'>) => {
      triggerHaptic();
      const newWallet: Wallet = {
        ...data,
        id: `wallet-${Date.now()}`,
        balance: data.initialBalance,
        createdAt: new Date().toISOString(),
      };

      const nextWallets = [...wallets, newWallet];
      const recomputed = recomputeWalletBalances(nextWallets, transactions);

      setWallets(recomputed);
      await StorageService.saveWallets(recomputed);
    },
    [wallets, transactions, triggerHaptic]
  );

  // Update wallet
  const updateWallet = useCallback(
    async (updated: Wallet) => {
      triggerHaptic();
      const nextWallets = wallets.map((w) => (w.id === updated.id ? updated : w));
      const recomputed = recomputeWalletBalances(nextWallets, transactions);

      setWallets(recomputed);
      await StorageService.saveWallets(recomputed);
    },
    [wallets, transactions, triggerHaptic]
  );

  // Delete wallet
  const deleteWallet = useCallback(
    async (id: string) => {
      triggerHaptic();
      const nextWallets = wallets.filter((w) => w.id !== id);
      setWallets(nextWallets);
      if (selectedWalletId === id) {
        setSelectedWalletId(null);
      }
      await StorageService.saveWallets(nextWallets);
    },
    [wallets, selectedWalletId, triggerHaptic]
  );

  // Add category
  const addCategory = useCallback(
    async (data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> => {
      triggerHaptic();
      const newCat: Category = {
        ...data,
        id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };

      const nextCats = [...categories, newCat];
      setCategories(nextCats);
      await StorageService.saveCategories(nextCats);
      return newCat;
    },
    [categories, triggerHaptic]
  );

  // Delete category
  const deleteCategory = useCallback(
    async (id: string) => {
      triggerHaptic();
      const nextCats = categories.filter((c) => c.id !== id);
      setCategories(nextCats);
      await StorageService.saveCategories(nextCats);
    },
    [categories, triggerHaptic]
  );

  // Reset all data
  const resetAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const reset = await StorageService.resetToDefaults();
      const recomputed = recomputeWalletBalances(reset.wallets, reset.transactions);
      setWallets(recomputed);
      setCategories(reset.categories);
      setTransactions(reset.transactions);
      setSelectedWalletId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtered transactions by period and selected wallet
  const filteredTransactions = useMemo(() => {
    const periodFiltered = filterTransactionsByPeriod(transactions, periodState.range);
    if (!selectedWalletId) {
      return periodFiltered;
    }
    return periodFiltered.filter(
      (tx) => tx.walletId === selectedWalletId || tx.toWalletId === selectedWalletId
    );
  }, [transactions, periodState.range, selectedWalletId]);

  // Total balance of all wallets
  const totalBalance = useMemo(() => {
    return calculateTotalBalance(wallets);
  }, [wallets]);

  // Cashflow for the current period
  const cashflow = useMemo(() => {
    return calculateCashflow(filteredTransactions);
  }, [filteredTransactions]);

  // Expense breakdown by category
  const expenseCategorySummaries = useMemo(() => {
    return calculateCategorySummaries(filteredTransactions, categories, 'expense');
  }, [filteredTransactions, categories]);

  // Income breakdown by category
  const incomeCategorySummaries = useMemo(() => {
    return calculateCategorySummaries(filteredTransactions, categories, 'income');
  }, [filteredTransactions, categories]);

  // Chart summaries
  const chartSummaries = useMemo(() => {
    return calculateChartSummaries(filteredTransactions, periodState.range);
  }, [filteredTransactions, periodState.range]);

  return (
    <MoneyContext.Provider
      value={{
        wallets,
        categories,
        transactions,
        filteredTransactions,
        isPrivacyMode,
        isLoading,
        periodState,
        selectedWalletId,
        totalBalance,
        cashflow,
        expenseCategorySummaries,
        incomeCategorySummaries,
        chartSummaries,
        togglePrivacyMode,
        setPeriod,
        setSelectedWalletId,
        addTransaction,
        deleteTransaction,
        addWallet,
        updateWallet,
        deleteWallet,
        addCategory,
        deleteCategory,
        resetAllData,
      }}
    >
      {children}
    </MoneyContext.Provider>
  );
};

export function useMoney(): MoneyContextType {
  const context = useContext(MoneyContext);
  if (!context) {
    throw new Error('useMoney must be used within a MoneyProvider');
  }
  return context;
}

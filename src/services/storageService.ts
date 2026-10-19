import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wallet, Category, Transaction } from '../types';
import { DEFAULT_WALLETS } from '../constants/defaultWallets';
import { DEFAULT_CATEGORIES } from '../constants/defaultCategories';
import { toDateString } from '../utils/dateUtils';

const KEYS = {
  WALLETS: '@moneytrack_wallets_v1',
  CATEGORIES: '@moneytrack_categories_v1',
  TRANSACTIONS: '@moneytrack_transactions_v1',
  PRIVACY_MODE: '@moneytrack_privacy_mode',
  INITIALIZED: '@moneytrack_initialized',
};

/**
 * Creates rich initial sample transactions for the current month
 * so the user can immediately experience the charts, wallets, and categories.
 */
function generateSeedTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const makeDate = (day: number, hour = 12, min = 0) => {
    const d = new Date(year, month, day, hour, min);
    return d.toISOString();
  };

  return [
    {
      id: 'tx-seed-1',
      type: 'income',
      amount: 7500000,
      walletId: 'wallet-bca',
      categoryId: 'cat-gaji',
      date: makeDate(1, 9, 30),
      note: 'Gaji Bulanan Masuk',
      createdAt: makeDate(1, 9, 30),
    },
    {
      id: 'tx-seed-2',
      type: 'expense',
      amount: 450000,
      walletId: 'wallet-bca',
      categoryId: 'cat-rumah',
      date: makeDate(3, 14, 15),
      note: 'Token Listrik PLN & Air',
      createdAt: makeDate(3, 14, 15),
    },
    {
      id: 'tx-seed-3',
      type: 'expense',
      amount: 320000,
      walletId: 'wallet-bca',
      categoryId: 'cat-pendidikan',
      date: makeDate(5, 10, 0),
      note: 'Beli Buku Pemrograman & Kursus Online',
      createdAt: makeDate(5, 10, 0),
    },
    {
      id: 'tx-seed-4',
      type: 'expense',
      amount: 175000,
      walletId: 'wallet-kas',
      categoryId: 'cat-belanja',
      date: makeDate(7, 16, 20),
      note: 'Belanja telur, beras & bumbu dapur',
      createdAt: makeDate(7, 16, 20),
    },
    {
      id: 'tx-seed-5',
      type: 'expense',
      amount: 45000,
      walletId: 'wallet-gopay',
      categoryId: 'cat-makanan',
      date: makeDate(8, 12, 45),
      note: 'Makan siang Nasi Padang + Es Teh',
      createdAt: makeDate(8, 12, 45),
    },
    {
      id: 'tx-seed-6',
      type: 'expense',
      amount: 80000,
      walletId: 'wallet-kas',
      categoryId: 'cat-transport',
      date: makeDate(10, 8, 30),
      note: 'Bensin Motor Shell V-Power',
      createdAt: makeDate(10, 8, 30),
    },
    {
      id: 'tx-seed-7',
      type: 'expense',
      amount: 95000,
      walletId: 'wallet-gopay',
      categoryId: 'cat-hiburan',
      date: makeDate(12, 19, 0),
      note: 'Langganan Streaming & Game',
      createdAt: makeDate(12, 19, 0),
    },
    {
      id: 'tx-seed-8',
      type: 'income',
      amount: 500000,
      walletId: 'wallet-bca',
      categoryId: 'cat-bonus',
      date: makeDate(14, 15, 0),
      note: 'Side project web bonus',
      createdAt: makeDate(14, 15, 0),
    },
    {
      id: 'tx-seed-9',
      type: 'expense',
      amount: 210000,
      walletId: 'wallet-bca',
      categoryId: 'cat-belanja',
      date: makeDate(Math.max(1, now.getDate() - 2), 17, 30),
      note: 'Belanja bulanan Supermarket',
      createdAt: makeDate(Math.max(1, now.getDate() - 2), 17, 30),
    },
    {
      id: 'tx-seed-10',
      type: 'expense',
      amount: 35000,
      walletId: 'wallet-gopay',
      categoryId: 'cat-makanan',
      date: makeDate(Math.max(1, now.getDate() - 1), 13, 0),
      note: 'Kopi Kenangan gula aren',
      createdAt: makeDate(Math.max(1, now.getDate() - 1), 13, 0),
    },
  ];
}

export const StorageService = {
  async initialize(): Promise<{
    wallets: Wallet[];
    categories: Category[];
    transactions: Transaction[];
  }> {
    try {
      const initialized = await AsyncStorage.getItem(KEYS.INITIALIZED);
      if (!initialized) {
        const seedTxs = generateSeedTransactions();
        await AsyncStorage.setItem(KEYS.WALLETS, JSON.stringify(DEFAULT_WALLETS));
        await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
        await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(seedTxs));
        await AsyncStorage.setItem(KEYS.INITIALIZED, 'true');

        return {
          wallets: DEFAULT_WALLETS,
          categories: DEFAULT_CATEGORIES,
          transactions: seedTxs,
        };
      }

      const [walletsStr, catsStr, txsStr] = await Promise.all([
        AsyncStorage.getItem(KEYS.WALLETS),
        AsyncStorage.getItem(KEYS.CATEGORIES),
        AsyncStorage.getItem(KEYS.TRANSACTIONS),
      ]);

      const wallets: Wallet[] = walletsStr ? JSON.parse(walletsStr) : DEFAULT_WALLETS;
      const categories: Category[] = catsStr ? JSON.parse(catsStr) : DEFAULT_CATEGORIES;
      const transactions: Transaction[] = txsStr ? JSON.parse(txsStr) : [];

      return { wallets, categories, transactions };
    } catch (e) {
      console.error('Failed to initialize storage:', e);
      return {
        wallets: DEFAULT_WALLETS,
        categories: DEFAULT_CATEGORIES,
        transactions: [],
      };
    }
  },

  async saveWallets(wallets: Wallet[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.WALLETS, JSON.stringify(wallets));
  },

  async saveCategories(categories: Category[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  async getPrivacyMode(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.PRIVACY_MODE);
    return val === 'true';
  },

  async savePrivacyMode(mode: boolean): Promise<void> {
    await AsyncStorage.setItem(KEYS.PRIVACY_MODE, mode ? 'true' : 'false');
  },

  async resetToDefaults(): Promise<{
    wallets: Wallet[];
    categories: Category[];
    transactions: Transaction[];
  }> {
    await AsyncStorage.clear();
    return this.initialize();
  },
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wallet, Category, Transaction } from '../types';
import { DEFAULT_WALLETS } from '../constants/defaultWallets';
import { DEFAULT_CATEGORIES } from '../constants/defaultCategories';
import { toDateString } from '../utils/dateUtils';

const KEYS = {
  WALLETS: '@moneytrack_wallets_v2',
  CATEGORIES: '@moneytrack_categories_v2',
  TRANSACTIONS: '@moneytrack_transactions_v2',
  PRIVACY_MODE: '@moneytrack_privacy_mode_v2',
  INITIALIZED: '@moneytrack_initialized_v2',
};

export const StorageService = {
  async initialize(): Promise<{
    wallets: Wallet[];
    categories: Category[];
    transactions: Transaction[];
  }> {
    try {
      const initialized = await AsyncStorage.getItem(KEYS.INITIALIZED);
      if (!initialized) {
        // Start completely clean: 0 demo transactions, fresh wallets ready for real user entries
        await AsyncStorage.setItem(KEYS.WALLETS, JSON.stringify(DEFAULT_WALLETS));
        await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
        await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
        await AsyncStorage.setItem(KEYS.INITIALIZED, 'true');

        return {
          wallets: DEFAULT_WALLETS,
          categories: DEFAULT_CATEGORIES,
          transactions: [],
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

  async clearAllTransactions(): Promise<void> {
    await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
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


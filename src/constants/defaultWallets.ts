import { Wallet } from '../types';

export const DEFAULT_WALLETS: Wallet[] = [
  {
    id: 'wallet-bca',
    name: 'Rekening Bank',
    type: 'bank',
    balance: 0,
    initialBalance: 0,
    color: '#3B82F6', // Blue
    icon: 'card',
    accountNumber: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wallet-kas',
    name: 'Uang Kas (Tunai)',
    type: 'cash',
    balance: 0,
    initialBalance: 0,
    color: '#10B981', // Emerald
    icon: 'wallet',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wallet-gopay',
    name: 'E-Wallet',
    type: 'ewallet',
    balance: 0,
    initialBalance: 0,
    color: '#06B6D4', // Cyan
    icon: 'phone-portrait',
    createdAt: new Date().toISOString(),
  },
];


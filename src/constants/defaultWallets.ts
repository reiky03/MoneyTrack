import { Wallet } from '../types';

export const DEFAULT_WALLETS: Wallet[] = [
  {
    id: 'wallet-bca',
    name: 'Uang Bank (BCA)',
    type: 'bank',
    balance: 5500000,
    initialBalance: 5500000,
    color: '#3B82F6', // Blue
    icon: 'card',
    accountNumber: '**** 8821',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wallet-kas',
    name: 'Uang Kas (Dompet)',
    type: 'cash',
    balance: 750000,
    initialBalance: 750000,
    color: '#10B981', // Emerald
    icon: 'wallet',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wallet-gopay',
    name: 'E-Wallet (GoPay)',
    type: 'ewallet',
    balance: 320000,
    initialBalance: 320000,
    color: '#06B6D4', // Cyan
    icon: 'phone-portrait',
    createdAt: new Date().toISOString(),
  },
];

import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Expense categories
  {
    id: 'cat-pendidikan',
    name: 'Pendidikan',
    type: 'expense',
    color: '#6366F1', // Indigo
    icon: 'school',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-belanja',
    name: 'Belanja',
    type: 'expense',
    color: '#10B981', // Emerald
    icon: 'cart',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-rumah',
    name: 'Rumah & Tagihan',
    type: 'expense',
    color: '#F59E0B', // Amber
    icon: 'home',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-makanan',
    name: 'Makanan & Minuman',
    type: 'expense',
    color: '#F97316', // Orange
    icon: 'restaurant',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-transport',
    name: 'Transportasi',
    type: 'expense',
    color: '#3B82F6', // Blue
    icon: 'car',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-hiburan',
    name: 'Hiburan & Hobi',
    type: 'expense',
    color: '#8B5CF6', // Purple
    icon: 'game-controller',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-kesehatan',
    name: 'Kesehatan',
    type: 'expense',
    color: '#EF4444', // Red
    icon: 'medkit',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-fashion',
    name: 'Pakaian & Fashion',
    type: 'expense',
    color: '#EC4899', // Pink
    icon: 'shirt',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },

  // Income categories
  {
    id: 'cat-gaji',
    name: 'Gaji Bulanan',
    type: 'income',
    color: '#10B981', // Emerald
    icon: 'briefcase',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-bonus',
    name: 'Bonus & Hadiah',
    type: 'income',
    color: '#06B6D4', // Cyan
    icon: 'gift',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-investasi',
    name: 'Hasil Investasi',
    type: 'income',
    color: '#8B5CF6', // Purple
    icon: 'trending-up',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat-income-lain',
    name: 'Pemasukan Lainnya',
    type: 'income',
    color: '#64748B', // Slate
    icon: 'cash',
    isSystem: true,
    createdAt: new Date().toISOString(),
  },
];

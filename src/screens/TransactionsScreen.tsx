import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { TransactionItem } from '../components/TransactionItem';
import { TransactionType } from '../types';
import { formatRupiah } from '../utils/formatters';

interface TransactionsScreenProps {
  onAddPress: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onAddPress }) => {
  const { filteredTransactions, categories, wallets, isPrivacyMode } = useMoney();

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterWalletId, setFilterWalletId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering
  const displayed = filteredTransactions.filter((tx) => {
    // Type match
    if (filterType !== 'all' && tx.type !== filterType) return false;

    // Wallet match
    if (
      filterWalletId !== 'all' &&
      tx.walletId !== filterWalletId &&
      tx.toWalletId !== filterWalletId
    ) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const noteMatch = tx.note?.toLowerCase().includes(q);
      const category = categories.find((c) => c.id === tx.categoryId);
      const catMatch = category?.name.toLowerCase().includes(q);
      if (!noteMatch && !catMatch) return false;
    }

    return true;
  });

  // Calculate sum for current filtered view
  const totalAmount = displayed.reduce((sum, tx) => {
    if (tx.type === 'expense') return sum + tx.amount;
    if (tx.type === 'income') return sum + tx.amount;
    return sum;
  }, 0);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Riwayat Transaksi</Text>
          <Text style={styles.subtitle}>
            {displayed.length} Transaksi ditemukan
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={onAddPress}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Catat</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari transaksi (cth: belanja telur, bensin)..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs (Semua, Pengeluaran, Pemasukan, Transfer) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <TouchableOpacity
          style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
          onPress={() => setFilterType('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              filterType === 'all' && styles.filterChipTextActive,
            ]}
          >
            Semua
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filterType === 'expense' && styles.filterChipActiveExpense,
          ]}
          onPress={() => setFilterType('expense')}
        >
          <Text
            style={[
              styles.filterChipText,
              filterType === 'expense' && styles.filterChipTextActive,
            ]}
          >
            Pengeluaran
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filterType === 'income' && styles.filterChipActiveIncome,
          ]}
          onPress={() => setFilterType('income')}
        >
          <Text
            style={[
              styles.filterChipText,
              filterType === 'income' && styles.filterChipTextActive,
            ]}
          >
            Pemasukan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filterType === 'transfer' && styles.filterChipActiveTransfer,
          ]}
          onPress={() => setFilterType('transfer')}
        >
          <Text
            style={[
              styles.filterChipText,
              filterType === 'transfer' && styles.filterChipTextActive,
            ]}
          >
            Transfer
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Wallet Filter Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.walletFilterRow}
      >
        <TouchableOpacity
          style={[
            styles.walletChip,
            filterWalletId === 'all' && styles.walletChipActive,
          ]}
          onPress={() => setFilterWalletId('all')}
        >
          <Text
            style={[
              styles.walletChipText,
              filterWalletId === 'all' && styles.walletChipTextActive,
            ]}
          >
            Semua Dompet
          </Text>
        </TouchableOpacity>

        {wallets.map((w) => (
          <TouchableOpacity
            key={w.id}
            style={[
              styles.walletChip,
              filterWalletId === w.id && styles.walletChipActive,
            ]}
            onPress={() => setFilterWalletId(w.id)}
          >
            <Ionicons
              name={(w.icon as any) || 'wallet'}
              size={12}
              color={filterWalletId === w.id ? '#FFFFFF' : w.color}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.walletChipText,
                filterWalletId === w.id && styles.walletChipTextActive,
              ]}
            >
              {w.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {displayed.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>Tidak ada transaksi</Text>
            <Text style={styles.emptySubtitle}>
              Coba sesuaikan filter atau tambahkan transaksi baru.
            </Text>
          </View>
        ) : (
          displayed.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))
        )}

        {/* Space for bottom navbar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.sizes.sm,
    paddingVertical: 0,
  },
  filterRow: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
    paddingVertical: 4,
  },
  filterChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipActiveExpense: {
    backgroundColor: Colors.expense,
    borderColor: Colors.expense,
  },
  filterChipActiveIncome: {
    backgroundColor: Colors.income,
    borderColor: Colors.income,
  },
  filterChipActiveTransfer: {
    backgroundColor: Colors.transfer,
    borderColor: Colors.transfer,
  },
  filterChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  walletFilterRow: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    paddingVertical: 2,
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  walletChipActive: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.primary,
  },
  walletChipText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  walletChipTextActive: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.bold,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});

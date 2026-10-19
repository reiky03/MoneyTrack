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

interface TransactionsScreenProps {
  onAddPress: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onAddPress }) => {
  const { filteredTransactions, categories, wallets } = useMoney();

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

      {/* Search Input Bar */}
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

      {/* Row 1: Segmented Type Filter (Semua | Pengeluaran | Pemasukan | Transfer) */}
      <View style={styles.typeSegmentWrapper}>
        <View style={styles.typeSegmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              filterType === 'all' && styles.segmentBtnActiveAll,
            ]}
            onPress={() => setFilterType('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === 'all' && styles.segmentTextActive,
              ]}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              filterType === 'expense' && styles.segmentBtnActiveExpense,
            ]}
            onPress={() => setFilterType('expense')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === 'expense' && styles.segmentTextActive,
              ]}
            >
              Keluar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              filterType === 'income' && styles.segmentBtnActiveIncome,
            ]}
            onPress={() => setFilterType('income')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === 'income' && styles.segmentTextActive,
              ]}
            >
              Masuk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              filterType === 'transfer' && styles.segmentBtnActiveTransfer,
            ]}
            onPress={() => setFilterType('transfer')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === 'transfer' && styles.segmentTextActive,
              ]}
            >
              Transfer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2: Source Wallet Filter (Scrollable with explicit container height to prevent any overlap) */}
      <View style={styles.walletFilterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.walletFilterContent}
          style={styles.walletFilterScroll}
        >
          <TouchableOpacity
            style={[
              styles.walletChip,
              filterWalletId === 'all' && styles.walletChipActive,
            ]}
            onPress={() => setFilterWalletId('all')}
            activeOpacity={0.7}
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
              activeOpacity={0.7}
            >
              <Ionicons
                name={(w.icon as any) || 'wallet'}
                size={12}
                color={filterWalletId === w.id ? '#FFFFFF' : w.color}
                style={{ marginRight: 5 }}
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
      </View>

      {/* Main Transaction List */}
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
        <View style={{ height: 110 }} />
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
    marginBottom: Spacing.sm,
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

  // Segmented Type Filter
  typeSegmentWrapper: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  typeSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: Radius.md,
  },
  segmentBtnActiveAll: {
    backgroundColor: Colors.primary,
  },
  segmentBtnActiveExpense: {
    backgroundColor: Colors.expense,
  },
  segmentBtnActiveIncome: {
    backgroundColor: Colors.income,
  },
  segmentBtnActiveTransfer: {
    backgroundColor: Colors.transfer,
  },
  segmentText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },

  // Wallet Filter Section
  walletFilterSection: {
    marginBottom: Spacing.sm,
    marginTop: 2,
  },
  walletFilterScroll: {
    flexGrow: 0,
  },
  walletFilterContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    alignItems: 'center',
    paddingVertical: 2,
  },
  walletChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  walletChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: Colors.primary,
  },
  walletChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
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

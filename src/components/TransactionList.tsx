import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { TransactionItem } from './TransactionItem';
import { groupTransactionsByDate } from '../utils/dateUtils';

interface TransactionListProps {
  onAddPress?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onAddPress }) => {
  const { filteredTransactions, categories } = useMoney();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by query (note or category name)
  const displayedTransactions = filteredTransactions.filter((tx) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const noteMatch = tx.note?.toLowerCase().includes(query);
    const category = categories.find((c) => c.id === tx.categoryId);
    const catMatch = category?.name.toLowerCase().includes(query);
    return noteMatch || catMatch;
  });

  const dateGroups = useMemo(() => {
    return groupTransactionsByDate(displayedTransactions);
  }, [displayedTransactions]);

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleBadge}>
          <Text style={styles.title}>Riwayat Transaksi</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{displayedTransactions.length}</Text>
          </View>
        </View>

        {onAddPress && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onAddPress}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={Colors.primaryLight} />
            <Text style={styles.addBtnText}>Catat</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari transaksi (cth: belanja telur, gaji)..."
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

      {/* List / Empty State */}
      {dateGroups.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="receipt-outline" size={28} color={Colors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>Belum Ada Transaksi</Text>
          <Text style={styles.emptySub}>
            {searchQuery
              ? 'Tidak ada transaksi yang cocok dengan kata pencarian ini.'
              : 'Tidak ada transaksi pada periode ini. Ketuk tombol di bawah untuk mencatat!'}
          </Text>
          {onAddPress && !searchQuery && (
            <TouchableOpacity
              style={styles.emptyActionBtn}
              onPress={onAddPress}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.emptyActionBtnText}>Catat Transaksi Sekarang</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        dateGroups.map((group) => (
          <View key={group.date} style={styles.dateGroup}>
            <View style={styles.dateHeaderRow}>
              <View style={styles.dateHeaderLeft}>
                <Ionicons name="calendar-outline" size={12} color={Colors.primaryLight} />
                <Text style={styles.dateHeaderText}>{group.title}</Text>
              </View>
              <View style={styles.dateHeaderRight}>
                <Text style={styles.dateHeaderCount}>
                  {group.transactions.length} transaksi
                </Text>
              </View>
            </View>

            {group.transactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                showOnlyTime={true}
              />
            ))}
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  countText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  addBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
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
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.sizes.sm,
    paddingVertical: 0,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderStyle: 'dashed',
    marginVertical: Spacing.sm,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 240,
    marginBottom: Spacing.md,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  dateGroup: {
    marginBottom: Spacing.sm,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  dateHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  dateHeaderRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  dateHeaderCount: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: Typography.weights.medium,
  },
});

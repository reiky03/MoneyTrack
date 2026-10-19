import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { formatRupiah } from '../utils/formatters';

export const CategoryBreakdown: React.FC = () => {
  const {
    expenseCategorySummaries,
    incomeCategorySummaries,
    isPrivacyMode,
  } = useMoney();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

  const summaries = activeTab === 'expense'
    ? expenseCategorySummaries
    : incomeCategorySummaries;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header & Type Toggle */}
        <View style={styles.header}>
          <Text style={styles.title}>Analisis Kategori</Text>

          <View style={styles.tabToggle}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'expense' && styles.tabBtnActiveExpense,
              ]}
              onPress={() => setActiveTab('expense')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'expense' && styles.tabBtnTextActive,
                ]}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'income' && styles.tabBtnActiveIncome,
              ]}
              onPress={() => setActiveTab('income')}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'income' && styles.tabBtnTextActive,
                ]}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List of categories */}
        {summaries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Belum ada {activeTab === 'expense' ? 'pengeluaran' : 'pemasukan'} pada periode ini
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {summaries.slice(0, 6).map((item) => (
              <View key={item.categoryId} style={styles.categoryItem}>
                <View style={styles.categoryMain}>
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: `${item.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={(item.icon as any) || 'pricetag'}
                      size={16}
                      color={item.color}
                    />
                  </View>

                  {/* Name & Count */}
                  <View style={styles.categoryMeta}>
                    <Text style={styles.categoryName}>{item.categoryName}</Text>
                    <Text style={styles.categoryCount}>
                      {item.transactionCount} transaksi ({item.percentage.toFixed(0)}%)
                    </Text>
                  </View>

                  {/* Amount */}
                  <Text style={styles.amountText}>
                    {formatRupiah(item.totalAmount, isPrivacyMode)}
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, Math.max(3, item.percentage))}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  tabBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  tabBtnActiveExpense: {
    backgroundColor: Colors.expense,
  },
  tabBtnActiveIncome: {
    backgroundColor: Colors.income,
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  list: {
    gap: Spacing.md,
  },
  categoryItem: {
    flexDirection: 'column',
    gap: 6,
  },
  categoryMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  categoryMeta: {
    flex: 1,
  },
  categoryName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  categoryCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  amountText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  progressTrack: {
    height: 5,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  emptyContainer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textTertiary,
  },
});

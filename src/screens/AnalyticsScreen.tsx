import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { PeriodFilterBar } from '../components/PeriodFilterBar';
import { PieChart } from '../components/PieChart';
import { CashflowChart } from '../components/CashflowChart';
import { formatRupiah } from '../utils/formatters';

export const AnalyticsScreen: React.FC = () => {
  const {
    cashflow,
    expenseCategorySummaries,
    incomeCategorySummaries,
    isPrivacyMode,
  } = useMoney();

  const [chartType, setChartType] = useState<'expense' | 'income'>('expense');

  const activeSummaries = chartType === 'expense'
    ? expenseCategorySummaries
    : incomeCategorySummaries;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analisis & Statistik</Text>
        <Text style={styles.subtitle}>
          Visualisasi grafik arus kas dan distribusi keuangan
        </Text>
      </View>

      {/* Flexible Month Navigator */}
      <PeriodFilterBar />

      {/* Summary Cards Row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={[styles.dot, { backgroundColor: Colors.income }]} />
            <Text style={styles.summaryLabel}>Total Pemasukan</Text>
          </View>
          <Text style={[styles.summaryVal, { color: Colors.income }]} numberOfLines={1}>
            {formatRupiah(cashflow.income, isPrivacyMode)}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={[styles.dot, { backgroundColor: Colors.expense }]} />
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
          </View>
          <Text style={[styles.summaryVal, { color: Colors.expense }]} numberOfLines={1}>
            {formatRupiah(cashflow.expense, isPrivacyMode)}
          </Text>
        </View>
      </View>

      {/* Pie / Donut Chart Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Distribusi Kategori (Pie Chart)</Text>

          {/* Toggle Expense vs Income for Pie Chart */}
          <View style={styles.chartToggle}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                chartType === 'expense' && styles.toggleBtnActiveExpense,
              ]}
              onPress={() => setChartType('expense')}
            >
              <Text
                style={[
                  styles.toggleText,
                  chartType === 'expense' && styles.toggleTextActive,
                ]}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleBtn,
                chartType === 'income' && styles.toggleBtnActiveIncome,
              ]}
              onPress={() => setChartType('income')}
            >
              <Text
                style={[
                  styles.toggleText,
                  chartType === 'income' && styles.toggleTextActive,
                ]}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Donut / Pie Chart */}
        <PieChart data={activeSummaries} isPrivacyMode={isPrivacyMode} />
      </View>

      {/* Cashflow Bar Chart (Pemasukan vs Pengeluaran Tren) */}
      <CashflowChart />

      {/* Bottom padding for floating navbar */}
      <View style={{ height: 110 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingTop: Spacing.md,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
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
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginVertical: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  summaryLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: Typography.weights.medium,
  },
  summaryVal: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  cardTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  chartToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.full,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  toggleBtnActiveExpense: {
    backgroundColor: Colors.expense,
  },
  toggleBtnActiveIncome: {
    backgroundColor: Colors.income,
  },
  toggleText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
});

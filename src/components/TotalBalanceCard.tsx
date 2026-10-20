import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { formatRupiah } from '../utils/formatters';

export const TotalBalanceCard: React.FC = () => {
  const { totalBalance, cashflow, isPrivacyMode, periodState } = useMoney();

  const isNetPositive = cashflow.net >= 0;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#1E1B4B', '#111827', '#0F172A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <Text style={styles.label}>TOTAL SALDO BERSIH</Text>
          <View style={styles.statusPill}>
            <View style={[styles.statusDot, { backgroundColor: Colors.income }]} />
            <Text style={styles.statusText}>Aktif</Text>
          </View>
        </View>

        {/* Big Balance Display */}
        <Text style={styles.balanceText} numberOfLines={1} adjustsFontSizeToFit>
          {formatRupiah(totalBalance, isPrivacyMode)}
        </Text>

        {/* Cashflow Summary Grid for Active Period */}
        <View style={styles.statsContainer}>
          {/* Income Box */}
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="arrow-up" size={13} color={Colors.income} />
              </View>
              <Text style={styles.statLabel}>Pemasukan</Text>
            </View>
            <Text style={[styles.statValue, { color: Colors.income }]} numberOfLines={1}>
              {formatRupiah(cashflow.income, isPrivacyMode)}
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.statDivider} />

          {/* Expense Box */}
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: 'rgba(244, 63, 94, 0.15)' }]}>
                <Ionicons name="arrow-down" size={13} color={Colors.expense} />
              </View>
              <Text style={styles.statLabel}>Pengeluaran</Text>
            </View>
            <Text style={[styles.statValue, { color: Colors.expense }]} numberOfLines={1}>
              {formatRupiah(cashflow.expense, isPrivacyMode)}
            </Text>
          </View>
        </View>

        {/* Cashflow Net Badge */}
        <View style={styles.netRow}>
          <Text style={styles.netPeriodText}>Periode {periodState.label}:</Text>
          <View
            style={[
              styles.netBadge,
              {
                backgroundColor: isNetPositive
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(244, 63, 94, 0.12)',
              },
            ]}
          >
            <Ionicons
              name={isNetPositive ? 'trending-up' : 'trending-down'}
              size={12}
              color={isNetPositive ? Colors.income : Colors.expense}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.netBadgeText,
                { color: isNetPositive ? Colors.income : Colors.expense },
              ]}
            >
              {isNetPositive ? 'Surplus ' : 'Defisit '}
              {formatRupiah(Math.abs(cashflow.net), isPrivacyMode)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.sm,
  },
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    letterSpacing: 1.2,
    fontWeight: Typography.weights.bold,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    color: Colors.income,
  },
  balanceText: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginVertical: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statBox: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  statValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: Spacing.md,
  },
  netRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.xs,
  },
  netPeriodText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
  },
  netBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  netBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { Header } from '../components/Header';
import { TotalBalanceCard } from '../components/TotalBalanceCard';
import { WalletSlider } from '../components/WalletSlider';
import { PeriodFilterBar } from '../components/PeriodFilterBar';
import { PieChart } from '../components/PieChart';
import { TransactionItem } from '../components/TransactionItem';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { AddWalletModal } from '../components/AddWalletModal';
import { ManageWalletsModal } from '../components/ManageWalletsModal';

interface DashboardScreenProps {
  onNavigateToTransactions?: () => void;
  onNavigateToAnalytics?: () => void;
  onAddTransactionPress?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToTransactions,
  onNavigateToAnalytics,
  onAddTransactionPress,
}) => {
  const {
    filteredTransactions,
    expenseCategorySummaries,
    isPrivacyMode,
    isLoading,
  } = useMoney();

  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showManageWalletsModal, setShowManageWalletsModal] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat MoneyTrack...</Text>
      </View>
    );
  }

  // Show recent 5 transactions on the home dashboard
  const recentTransactions = filteredTransactions.slice(0, 5);

  return (
    <View style={styles.container}>
      {/* Scrollable View */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with greeting, date & privacy toggle */}
        <Header onOpenWallets={() => setShowManageWalletsModal(true)} />

        {/* Total Net Balance Card with Income/Expense cashflow */}
        <TotalBalanceCard />

        {/* Quick Wallets Horizontal Slider */}
        <WalletSlider
          onAddWalletPress={() => setShowAddWalletModal(true)}
          onWalletManagePress={() => setShowManageWalletsModal(true)}
        />

        {/* Period Month Navigator Bar */}
        <PeriodFilterBar />

        {/* Category Distribution Pie Chart right on Home Screen */}
        <View style={styles.pieCard}>
          <View style={styles.pieCardHeader}>
            <View>
              <Text style={styles.pieCardTitle}>Distribusi Pengeluaran</Text>
              <Text style={styles.pieCardSub}>Rincian belanja per kategori</Text>
            </View>
            {onNavigateToAnalytics && (
              <TouchableOpacity
                onPress={onNavigateToAnalytics}
                style={styles.seeMoreBtn}
              >
                <Text style={styles.seeMoreText}>Lihat Analisis</Text>
                <Ionicons name="chevron-forward" size={13} color={Colors.primaryLight} />
              </TouchableOpacity>
            )}
          </View>

          <PieChart
            data={expenseCategorySummaries}
            isPrivacyMode={isPrivacyMode}
          />
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
            {onNavigateToTransactions && filteredTransactions.length > 0 && (
              <TouchableOpacity
                onPress={onNavigateToTransactions}
                style={styles.seeAllBtn}
              >
                <Text style={styles.seeAllText}>Lihat Semua</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.primaryLight} />
              </TouchableOpacity>
            )}
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="receipt-outline" size={32} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>Belum ada transaksi di periode ini</Text>
            </View>
          ) : (
            recentTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))
          )}
        </View>

        {/* Bottom padding for floating navbar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Modals */}
      <AddTransactionModal
        visible={showAddTxModal}
        onClose={() => setShowAddTxModal(false)}
      />

      <AddWalletModal
        visible={showAddWalletModal}
        onClose={() => setShowAddWalletModal(false)}
      />

      <ManageWalletsModal
        visible={showManageWalletsModal}
        onClose={() => setShowManageWalletsModal(false)}
        onAddWalletPress={() => setShowAddWalletModal(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  pieCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  pieCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  pieCardTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  pieCardSub: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 1,
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  seeMoreText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  recentSection: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
  },
});

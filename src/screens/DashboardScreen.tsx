import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { Header } from '../components/Header';
import { TotalBalanceCard } from '../components/TotalBalanceCard';
import { WalletSlider } from '../components/WalletSlider';
import { PeriodFilterBar } from '../components/PeriodFilterBar';
import { CashflowChart } from '../components/CashflowChart';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { TransactionList } from '../components/TransactionList';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { AddWalletModal } from '../components/AddWalletModal';
import { ManageWalletsModal } from '../components/ManageWalletsModal';

export const DashboardScreen: React.FC = () => {
  const { isLoading } = useMoney();

  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showManageWalletsModal, setShowManageWalletsModal] = useState(false);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat MoneyTrack...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main Scrollable View */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Title, Date, and Privacy Eye Toggle */}
        <Header
          onOpenWallets={() => setShowManageWalletsModal(true)}
        />

        {/* Total Net Balance Card with Income/Expense Cashflow */}
        <TotalBalanceCard />

        {/* Wallets & Source of Funds Slider */}
        <WalletSlider
          onAddWalletPress={() => setShowAddWalletModal(true)}
          onWalletManagePress={() => setShowManageWalletsModal(true)}
        />

        {/* Period Filter Bar (Bulan ini, Bulan lalu, Kustom tanggal, dll.) */}
        <PeriodFilterBar />

        {/* Cashflow Chart (Pemasukan vs Pengeluaran per waktu) */}
        <CashflowChart />

        {/* Category Breakdown (Pendidikan, Belanja, Rumah, Makanan, dll.) */}
        <CategoryBreakdown />

        {/* Transaction History List with Search & Actions */}
        <TransactionList onAddPress={() => setShowAddTxModal(true)} />

        {/* Bottom padding for FAB */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Action Button (FAB) to Add Transaction */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddTxModal(true)}
        activeOpacity={0.85}
        accessibilityLabel="Tambah Transaksi"
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
        <Text style={styles.fabText}>Catat Transaksi</Text>
      </TouchableOpacity>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: Radius.full,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});

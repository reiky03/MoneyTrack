import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { useAlert } from '../context/AlertContext';
import { Wallet } from '../types';
import { formatRupiah } from '../utils/formatters';
import { AddWalletModal } from '../components/AddWalletModal';
import { EditWalletModal } from '../components/EditWalletModal';

export const WalletsScreen: React.FC = () => {
  const {
    wallets,
    totalBalance,
    isPrivacyMode,
    deleteWallet,
    clearAllTransactions,
    resetAllData,
  } = useMoney();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const { showAlert, showConfirm } = useAlert();

  const handleDelete = (wallet: Wallet) => {
    if (wallets.length <= 1) {
      showAlert({
        title: 'Perhatian',
        message: 'Minimal harus ada 1 dompet / sumber uang aktif di aplikasi ya beb.',
        type: 'warning',
      });
      return;
    }

    showConfirm({
      title: 'Hapus Dompet',
      message: `Yakin ingin menghapus ${wallet.name}? Transaksi yang terkait tidak akan terhapus namun sumber dananya akan kosong.`,
      confirmText: 'Hapus Dompet',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: () => deleteWallet(wallet.id),
    });
  };

  const handleClearTransactions = () => {
    showConfirm({
      title: 'Kosongkan Transaksi',
      message: 'Yakin ingin menghapus seluruh riwayat transaksi untuk mulai mencatat keuangan asli? Saldo dompet akan kembali ke nilai awal.',
      confirmText: 'Kosongkan',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: () => clearAllTransactions(),
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Fixed Header */}
      <View style={styles.fixedHeader}>
        <View>
          <Text style={styles.title}>Dompet & Sumber Uang</Text>
          <Text style={styles.subtitle}>
            Kelola semua rekening bank, uang kas, dan e-wallet
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

      {/* Total Net Worth Card */}
      <View style={styles.netWorthCard}>
        <Text style={styles.netWorthLabel}>TOTAL SALDO KESELURUHAN</Text>
        <Text style={styles.netWorthValue}>
          {formatRupiah(totalBalance, isPrivacyMode)}
        </Text>
        <Text style={styles.netWorthCount}>
          Terbagi di {wallets.length} sumber dana aktif
        </Text>
      </View>

      {/* Wallets List */}
      <View style={styles.list}>
        {wallets.map((wallet) => (
          <View key={wallet.id} style={styles.walletCard}>
            {/* Top row */}
            <View style={styles.walletTop}>
              <View
                style={[
                  styles.walletIconCircle,
                  { backgroundColor: `${wallet.color}25` },
                ]}
              >
                <Ionicons
                  name={(wallet.icon as any) || 'wallet'}
                  size={22}
                  color={wallet.color}
                />
              </View>

              <View style={styles.walletMeta}>
                <Text style={styles.walletName}>{wallet.name}</Text>
                <Text style={styles.walletType}>
                  {wallet.type.toUpperCase()} • {wallet.accountNumber || 'Aktif'}
                </Text>
              </View>

              <View style={styles.walletActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setEditingWallet(wallet)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={14} color={Colors.primaryLight} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.trashBtn}
                  onPress={() => handleDelete(wallet)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom row */}
            <TouchableOpacity
              style={styles.walletBottom}
              onPress={() => setEditingWallet(wallet)}
              activeOpacity={0.75}
            >
              <View>
                <Text style={styles.balanceLabel}>Saldo Saat Ini</Text>
                <Text style={styles.balanceVal}>
                  {formatRupiah(wallet.balance, isPrivacyMode)}
                </Text>
              </View>
              <View style={styles.adjustPill}>
                <Ionicons name="options-outline" size={13} color={Colors.primaryLight} />
                <Text style={styles.adjustPillText}>Sesuaikan Saldo</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Clear Transactions Button */}
      <TouchableOpacity
        style={styles.resetBtn}
        onPress={handleClearTransactions}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={15} color={Colors.expense} />
        <Text style={[styles.resetBtnText, { color: Colors.expense }]}>
          Kosongkan Seluruh Riwayat Transaksi
        </Text>
      </TouchableOpacity>

      {/* Space for bottom navbar */}
      <View style={{ height: 110 }} />
    </ScrollView>

      {/* Add Wallet Modal */}
      <AddWalletModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Edit Wallet Modal */}
      <EditWalletModal
        visible={!!editingWallet}
        wallet={editingWallet}
        onClose={() => setEditingWallet(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fixedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: Spacing.sm,
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
  netWorthCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    marginBottom: Spacing.lg,
  },
  netWorthLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  netWorthValue: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  netWorthCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  walletCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  walletTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  walletIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  walletMeta: {
    flex: 1,
  },
  walletName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  walletType: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
    fontWeight: Typography.weights.medium,
  },
  walletActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.md,
  },
  editBtnText: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  trashBtn: {
    padding: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: Radius.md,
  },
  walletBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    paddingTop: Spacing.sm,
  },
  balanceLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
  },
  balanceVal: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  adjustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  adjustPillText: {
    fontSize: 10,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
    opacity: 0.6,
  },
  resetBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
  },
});

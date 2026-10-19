import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { Wallet } from '../types';
import { formatRupiah } from '../utils/formatters';
import { AddWalletModal } from '../components/AddWalletModal';

export const WalletsScreen: React.FC = () => {
  const {
    wallets,
    totalBalance,
    isPrivacyMode,
    deleteWallet,
    resetAllData,
  } = useMoney();

  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (wallet: Wallet) => {
    if (wallets.length <= 1) {
      Alert.alert('Perhatian', 'Minimal harus ada 1 dompet / sumber uang aktif.');
      return;
    }

    Alert.alert(
      'Hapus Dompet',
      `Yakin ingin menghapus ${wallet.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => deleteWallet(wallet.id),
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Data Demo',
      'Apakah kamu ingin mengembalikan data ke kondisi awal contoh?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetAllData(),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
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

              <TouchableOpacity
                style={styles.trashBtn}
                onPress={() => handleDelete(wallet)}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.textTertiary} />
              </TouchableOpacity>
            </View>

            {/* Bottom row */}
            <View style={styles.walletBottom}>
              <Text style={styles.balanceLabel}>Saldo Saat Ini</Text>
              <Text style={styles.balanceVal}>
                {formatRupiah(wallet.balance, isPrivacyMode)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Reset Data Button */}
      <TouchableOpacity
        style={styles.resetBtn}
        onPress={handleReset}
        activeOpacity={0.7}
      >
        <Ionicons name="refresh-outline" size={16} color={Colors.textTertiary} />
        <Text style={styles.resetBtnText}>Reset ke Data Awal (Demo)</Text>
      </TouchableOpacity>

      {/* Space for bottom navbar */}
      <View style={{ height: 110 }} />

      {/* Add Wallet Modal */}
      <AddWalletModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
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
  trashBtn: {
    padding: Spacing.xs,
  },
  walletBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { Wallet } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ManageWalletsModalProps {
  visible: boolean;
  onClose: () => void;
  onAddWalletPress: () => void;
}

export const ManageWalletsModal: React.FC<ManageWalletsModalProps> = ({
  visible,
  onClose,
  onAddWalletPress,
}) => {
  const { wallets, deleteWallet, resetAllData, isPrivacyMode } = useMoney();

  const handleDeleteWallet = (wallet: Wallet) => {
    if (wallets.length <= 1) {
      Alert.alert('Perhatian', 'Minimal harus ada 1 sumber uang di aplikasi.');
      return;
    }

    Alert.alert(
      'Hapus Sumber Uang',
      `Yakin ingin menghapus ${wallet.name}? Transaksi yang berkaitan tidak akan dihapus.`,
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

  const handleResetData = () => {
    Alert.alert(
      'Reset Data Aplikasi',
      'Apakah kamu ingin mengembalikan data aplikasi ke kondisi awal contoh?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Kelola Sumber Uang</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
            {wallets.map((wallet) => (
              <View key={wallet.id} style={styles.walletItem}>
                <View
                  style={[
                    styles.walletIconCircle,
                    { backgroundColor: `${wallet.color}22` },
                  ]}
                >
                  <Ionicons
                    name={(wallet.icon as any) || 'wallet'}
                    size={20}
                    color={wallet.color}
                  />
                </View>

                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>{wallet.name}</Text>
                  <Text style={styles.walletBalance}>
                    Saldo: {formatRupiah(wallet.balance, isPrivacyMode)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteWallet(wallet)}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.expense} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add New Wallet Button */}
            <TouchableOpacity
              style={styles.addNewBtn}
              onPress={() => {
                onClose();
                onAddWalletPress();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={18} color={Colors.primaryLight} />
              <Text style={styles.addNewBtnText}>Tambah Dompet / Akun Baru</Text>
            </TouchableOpacity>

            {/* Reset App Data Button */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetData}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh-circle-outline" size={18} color={Colors.textTertiary} />
              <Text style={styles.resetBtnText}>Reset ke Data Awal (Demo)</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    maxHeight: '80%',
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
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  list: {
    paddingVertical: Spacing.xs,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.sm,
  },
  walletIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  walletBalance: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
  },
  addNewBtnText: {
    color: Colors.primaryLight,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    opacity: 0.7,
  },
  resetBtnText: {
    color: Colors.textTertiary,
    fontSize: Typography.sizes.xs,
  },
});

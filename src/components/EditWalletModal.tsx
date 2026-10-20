import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { useAlert } from '../context/AlertContext';
import { Wallet, WalletType } from '../types';
import { formatNumberWithDots, parseCurrencyInput, formatRupiah } from '../utils/formatters';

interface EditWalletModalProps {
  visible: boolean;
  wallet: Wallet | null;
  onClose: () => void;
}

const WALLET_TYPES: { type: WalletType; label: string; icon: string }[] = [
  { type: 'bank', label: 'Rekening Bank', icon: 'card' },
  { type: 'cash', label: 'Uang Kas / Tunai', icon: 'wallet' },
  { type: 'ewallet', label: 'E-Wallet', icon: 'phone-portrait' },
  { type: 'investment', label: 'Investasi', icon: 'trending-up' },
];

export const EditWalletModal: React.FC<EditWalletModalProps> = ({
  visible,
  wallet,
  onClose,
}) => {
  const { adjustWalletBalance, deleteWallet, wallets, isPrivacyMode } = useMoney();
  const { showAlert, showConfirm } = useAlert();

  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<WalletType>('bank');
  const [balanceText, setBalanceText] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(Colors.presetPalette[2]);
  const [selectedIcon, setSelectedIcon] = useState<string>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible && wallet) {
      setName(wallet.name);
      setSelectedType(wallet.type);
      setBalanceText(wallet.balance > 0 ? formatNumberWithDots(wallet.balance) : wallet.balance === 0 ? '0' : String(wallet.balance));
      setSelectedColor(wallet.color || Colors.presetPalette[2]);
      setSelectedIcon(wallet.icon || 'card');
    }
  }, [visible, wallet]);

  if (!wallet) return null;

  const handleAmountChange = (text: string) => {
    const numeric = parseCurrencyInput(text);
    setBalanceText(numeric > 0 ? formatNumberWithDots(numeric) : '');
  };

  const handleTypeSelect = (item: (typeof WALLET_TYPES)[0]) => {
    setSelectedType(item.type);
    setSelectedIcon(item.icon);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert({
        title: 'Perhatian',
        message: 'Nama dompet / akun tidak boleh kosong ya beb.',
        type: 'warning',
      });
      return;
    }

    const newBalance = parseCurrencyInput(balanceText);

    try {
      setIsSubmitting(true);
      await adjustWalletBalance(wallet.id, newBalance, {
        name: name.trim(),
        type: selectedType,
        color: selectedColor,
        icon: selectedIcon,
      });

      onClose();
    } catch {
      showAlert({
        title: 'Gagal',
        message: 'Terjadi kesalahan saat menyimpan perubahan dompet.',
        type: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (wallets.length <= 1) {
      showAlert({
        title: 'Perhatian',
        message: 'Minimal harus ada 1 dompet / sumber uang aktif di aplikasi.',
        type: 'warning',
      });
      return;
    }

    showConfirm({
      title: 'Hapus Dompet',
      message: `Yakin ingin menghapus ${wallet.name}? Transaksi yang ada tidak akan terhapus.`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: async () => {
        await deleteWallet(wallet.id);
        onClose();
      },
    });
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
            <View>
              <Text style={styles.title}>Edit & Penyesuaian Saldo</Text>
              <Text style={styles.subtitle}>Sesuaikan saldo riil dan rincian akun</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteIconBtn}>
                <Ionicons name="trash-outline" size={18} color={Colors.expense} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* Balance Adjustment Section (Main Highlight) */}
            <View style={styles.balanceSection}>
              <View style={styles.balanceHeaderRow}>
                <Text style={styles.inputLabel}>SALDO SEBENARNYA SAAT INI (PENYESUAIAN)</Text>
                <View style={styles.badgeRecorded}>
                  <Text style={styles.badgeRecordedText}>
                    Tercatat: {formatRupiah(wallet.balance, isPrivacyMode)}
                  </Text>
                </View>
              </View>

              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencyPrefix}>Rp</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                  value={balanceText}
                  onChangeText={handleAmountChange}
                />
              </View>

              <Text style={styles.balanceHelpText}>
                💡 Ubah jika nominal berbeda dengan saldo fisik/rekening aslimu. Saldo akan disesuaikan otomatis tanpa menghilangkan riwayat transaksi.
              </Text>
            </View>

            {/* Wallet Type Selection */}
            <Text style={styles.inputLabel}>TIPE SUMBER DANA</Text>
            <View style={styles.typeGrid}>
              {WALLET_TYPES.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <TouchableOpacity
                    key={item.type}
                    style={[
                      styles.typeCard,
                      isSelected && styles.typeCardSelected,
                    ]}
                    onPress={() => handleTypeSelect(item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={isSelected ? Colors.primaryLight : Colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeLabel,
                        isSelected && styles.typeLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Name Input */}
            <Text style={styles.inputLabel}>NAMA AKUN / DOMPET</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="misal: Uang Bank BCA, Uang Kas, ShopeePay..."
                placeholderTextColor={Colors.textTertiary}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Color Palette */}
            <Text style={styles.inputLabel}>WARNA TEMA KARTU</Text>
            <View style={styles.paletteRow}>
              {Colors.presetPalette.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                      isSelected && styles.colorDotSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveBtn, isSubmitting && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>
                {isSubmitting ? 'Menyimpan Perubahan...' : 'Simpan Penyesuaian Saldo'}
              </Text>
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
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    maxHeight: '90%',
    paddingBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceBorder,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  deleteIconBtn: {
    padding: Spacing.xs,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderRadius: Radius.full,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  scroll: {
    padding: Spacing.xl,
  },
  balanceSection: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: Spacing.lg,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    flexWrap: 'wrap',
    gap: 4,
  },
  badgeRecorded: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  badgeRecordedText: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: Typography.weights.medium,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  currencyPrefix: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    padding: 0,
  },
  balanceHelpText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: Spacing.xs,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typeCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  typeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  typeLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  typeLabelSelected: {
    color: Colors.primaryLight,
    fontWeight: Typography.weights.bold,
  },
  inputWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.md,
  },
  textInput: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    padding: 0,
  },
  paletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
});

import React, { useState } from 'react';
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
import { WalletType } from '../types';
import { formatNumberWithDots, parseCurrencyInput } from '../utils/formatters';

interface AddWalletModalProps {
  visible: boolean;
  onClose: () => void;
}

const WALLET_TYPES: { type: WalletType; label: string; icon: string }[] = [
  { type: 'bank', label: 'Rekening Bank', icon: 'card' },
  { type: 'cash', label: 'Uang Kas / Tunai', icon: 'wallet' },
  { type: 'ewallet', label: 'E-Wallet', icon: 'phone-portrait' },
  { type: 'investment', label: 'Investasi', icon: 'trending-up' },
];

export const AddWalletModal: React.FC<AddWalletModalProps> = ({
  visible,
  onClose,
}) => {
  const { addWallet } = useMoney();

  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<WalletType>('bank');
  const [initialBalanceText, setInitialBalanceText] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(Colors.presetPalette[2]); // Blue
  const [selectedIcon, setSelectedIcon] = useState<string>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (text: string) => {
    const numeric = parseCurrencyInput(text);
    setInitialBalanceText(numeric > 0 ? formatNumberWithDots(numeric) : '');
  };

  const handleTypeSelect = (item: (typeof WALLET_TYPES)[0]) => {
    setSelectedType(item.type);
    setSelectedIcon(item.icon);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Perhatian', 'Nama dompet / akun wajib diisi.');
      return;
    }

    const initialBalance = parseCurrencyInput(initialBalanceText);

    try {
      setIsSubmitting(true);
      await addWallet({
        name: name.trim(),
        type: selectedType,
        initialBalance,
        color: selectedColor,
        icon: selectedIcon,
      });

      setName('');
      setInitialBalanceText('');
      onClose();
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menambah akun.');
    } finally {
      setIsSubmitting(false);
    }
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
            <Text style={styles.title}>Tambah Sumber Uang / Dompet</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
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

            {/* Initial Balance Input */}
            <Text style={styles.inputLabel}>SALDO AWAL SAAT INI (OPSIONAL)</Text>
            <View style={styles.amountInputWrapper}>
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
                value={initialBalanceText}
                onChangeText={handleAmountChange}
              />
            </View>

            {/* Color Palette */}
            <Text style={styles.inputLabel}>WARNA KARTU</Text>
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
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.saveBtn, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Sumber Uang'}
            </Text>
          </TouchableOpacity>
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
    maxHeight: '90%',
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
  inputLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
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
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  typeLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  typeLabelSelected: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.bold,
  },
  inputWrapper: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  textInput: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.base,
    padding: 0,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.xs,
  },
  currencyPrefix: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textTertiary,
  },
  amountInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    padding: 0,
  },
  paletteRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: Spacing.xs,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});

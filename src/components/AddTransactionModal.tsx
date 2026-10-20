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
import { TransactionType, Category } from '../types';
import {
  formatNumberWithDots,
  parseCurrencyInput,
  formatRupiah,
} from '../utils/formatters';
import { AddCategoryModal } from './AddCategoryModal';
import { formatDateIndonesian, toDateString } from '../utils/dateUtils';

interface AddTransactionModalProps {
  visible: boolean;
  initialType?: TransactionType;
  onClose: () => void;
}

const QUICK_AMOUNTS = [
  { label: '+10rb', value: 10000 },
  { label: '+25rb', value: 25000 },
  { label: '+50rb', value: 50000 },
  { label: '+100rb', value: 100000 },
  { label: '+500rb', value: 500000 },
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  initialType = 'expense',
  onClose,
}) => {
  const {
    wallets,
    categories,
    addTransaction,
    isPrivacyMode,
  } = useMoney();

  const { showAlert } = useAlert();

  const [type, setType] = useState<TransactionType>(initialType);
  const [amountText, setAmountText] = useState<string>('');
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const [targetWalletId, setTargetWalletId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  
  // Date states
  const [dateOption, setDateOption] = useState<'today' | 'yesterday' | 'custom'>('today');
  const [customDate, setCustomDate] = useState<string>(toDateString(new Date()));
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize defaults when modal opens
  useEffect(() => {
    if (visible) {
      setType(initialType);
      setAmountText('');
      setNote('');
      setDateOption('today');
      setCustomDate(toDateString(new Date()));
      setShowDatePicker(false);

      // Default wallet
      if (wallets.length > 0) {
        setSelectedWalletId(wallets[0].id);
        if (wallets.length > 1) {
          setTargetWalletId(wallets[1].id);
        }
      }

      // Default category
      const filteredCats = categories.filter(
        (c) => c.type === (initialType === 'income' ? 'income' : 'expense')
      );
      if (filteredCats.length > 0) {
        setSelectedCategoryId(filteredCats[0].id);
      }
    }
  }, [visible, initialType, wallets, categories]);

  // Adjust available categories when type changes
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType !== 'transfer') {
      const match = categories.find((c) => c.type === newType);
      if (match) setSelectedCategoryId(match.id);
    }
  };

  const handleAmountChange = (text: string) => {
    const numeric = parseCurrencyInput(text);
    setAmountText(numeric > 0 ? formatNumberWithDots(numeric) : '');
  };

  const addQuickAmount = (increment: number) => {
    const current = parseCurrencyInput(amountText);
    const updated = current + increment;
    setAmountText(formatNumberWithDots(updated));
  };

  const handleCategoryCreated = (newCat: Category) => {
    setSelectedCategoryId(newCat.id);
  };

  const adjustCustomDate = (unit: 'year' | 'month' | 'day', amount: number) => {
    const parts = customDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);

    if (unit === 'year') d.setFullYear(d.getFullYear() + amount);
    if (unit === 'month') d.setMonth(d.getMonth() + amount);
    if (unit === 'day') d.setDate(d.getDate() + amount);

    setCustomDate(toDateString(d));
  };

  const handleSave = async () => {
    const numericAmount = parseCurrencyInput(amountText);

    if (numericAmount <= 0) {
      showAlert({
        title: 'Perhatian',
        message: 'Nominal transaksi harus lebih dari 0 ya beb.',
        type: 'warning',
      });
      return;
    }

    if (!selectedWalletId) {
      showAlert({
        title: 'Perhatian',
        message: 'Pilih sumber uangnya dulu ya beb.',
        type: 'warning',
      });
      return;
    }

    if (type === 'transfer' && (!targetWalletId || targetWalletId === selectedWalletId)) {
      showAlert({
        title: 'Perhatian',
        message: 'Pilih dompet tujuan yang berbeda untuk transfer antar-dompet.',
        type: 'warning',
      });
      return;
    }

    if (type !== 'transfer' && !selectedCategoryId) {
      showAlert({
        title: 'Perhatian',
        message: 'Pilih kategori transaksi ya beb.',
        type: 'warning',
      });
      return;
    }

    // Determine final ISO date
    let finalDateIso = new Date().toISOString();
    if (dateOption === 'yesterday') {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      finalDateIso = y.toISOString();
    } else if (dateOption === 'custom') {
      const parts = customDate.split('-').map(Number);
      const c = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      finalDateIso = c.toISOString();
    }

    try {
      setIsSubmitting(true);
      await addTransaction({
        type,
        amount: numericAmount,
        walletId: selectedWalletId,
        toWalletId: type === 'transfer' ? targetWalletId : undefined,
        categoryId: type !== 'transfer' ? selectedCategoryId : undefined,
        date: finalDateIso,
        note: note.trim() || undefined,
      });

      onClose();
    } catch {
      showAlert({
        title: 'Gagal',
        message: 'Terjadi kesalahan saat menyimpan transaksi.',
        type: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCategories = categories.filter(
    (c) => c.type === (type === 'income' ? 'income' : 'expense')
  );

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
            <Text style={styles.title}>
              {type === 'expense'
                ? 'Catat Pengeluaran'
                : type === 'income'
                ? 'Catat Pemasukan'
                : 'Catat Transfer'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Type Selector (Pengeluaran | Pemasukan | Transfer) */}
          <View style={styles.typeTabs}>
            <TouchableOpacity
              style={[
                styles.typeTab,
                type === 'expense' && styles.typeTabActiveExpense,
              ]}
              onPress={() => handleTypeChange('expense')}
            >
              <Ionicons
                name="arrow-down"
                size={14}
                color={type === 'expense' ? '#FFFFFF' : Colors.expense}
              />
              <Text
                style={[
                  styles.typeTabText,
                  type === 'expense' && styles.typeTabTextActive,
                ]}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeTab,
                type === 'income' && styles.typeTabActiveIncome,
              ]}
              onPress={() => handleTypeChange('income')}
            >
              <Ionicons
                name="arrow-up"
                size={14}
                color={type === 'income' ? '#FFFFFF' : Colors.income}
              />
              <Text
                style={[
                  styles.typeTabText,
                  type === 'income' && styles.typeTabTextActive,
                ]}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeTab,
                type === 'transfer' && styles.typeTabActiveTransfer,
              ]}
              onPress={() => handleTypeChange('transfer')}
            >
              <Ionicons
                name="swap-horizontal"
                size={14}
                color={type === 'transfer' ? '#FFFFFF' : Colors.transfer}
              />
              <Text
                style={[
                  styles.typeTabText,
                  type === 'transfer' && styles.typeTabTextActive,
                ]}
              >
                Transfer
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
            {/* Amount Big Display & Input */}
            <View style={styles.amountBox}>
              <Text style={styles.currencyLabel}>NOMINAL TRANSAKSI</Text>
              <View style={styles.amountRow}>
                <Text style={styles.rpSign}>Rp</Text>
                <TextInput
                  style={[
                    styles.amountInput,
                    type === 'expense' && { color: Colors.expenseLight },
                    type === 'income' && { color: Colors.incomeLight },
                    type === 'transfer' && { color: Colors.transferLight },
                  ]}
                  placeholder="0"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                  value={amountText}
                  onChangeText={handleAmountChange}
                  autoFocus={true}
                />
              </View>

              {/* Quick Increment Chips */}
              <View style={styles.quickChipsRow}>
                {QUICK_AMOUNTS.map((chip) => (
                  <TouchableOpacity
                    key={chip.label}
                    style={styles.quickChip}
                    onPress={() => addQuickAmount(chip.value)}
                  >
                    <Text style={styles.quickChipText}>{chip.label}</Text>
                  </TouchableOpacity>
                ))}
                {amountText.length > 0 && (
                  <TouchableOpacity
                    style={[styles.quickChip, styles.resetChip]}
                    onPress={() => setAmountText('')}
                  >
                    <Ionicons name="refresh" size={12} color={Colors.textTertiary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Source Wallet (Sumber Uang) */}
            <Text style={styles.inputLabel}>
              {type === 'transfer' ? 'DARI SUMBER UANG' : 'SUMBER UANG'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.walletPickerRow}
            >
              {wallets.map((wallet) => {
                const isSelected = selectedWalletId === wallet.id;
                return (
                  <TouchableOpacity
                    key={wallet.id}
                    style={[
                      styles.walletOption,
                      isSelected && styles.walletOptionSelected,
                    ]}
                    onPress={() => setSelectedWalletId(wallet.id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.walletIconCircle,
                        { backgroundColor: `${wallet.color}25` },
                      ]}
                    >
                      <Ionicons
                        name={(wallet.icon as any) || 'wallet'}
                        size={16}
                        color={wallet.color}
                      />
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.walletOptionName,
                          isSelected && styles.walletOptionNameSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {wallet.name}
                      </Text>
                      <Text style={styles.walletOptionBalance}>
                        {formatRupiah(wallet.balance, isPrivacyMode)}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={Colors.primaryLight}
                        style={{ marginLeft: 6 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Target Wallet (If Transfer) */}
            {type === 'transfer' && (
              <>
                <Text style={styles.inputLabel}>KE DOMPET TUJUAN</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.walletPickerRow}
                >
                  {wallets
                    .filter((w) => w.id !== selectedWalletId)
                    .map((wallet) => {
                      const isSelected = targetWalletId === wallet.id;
                      return (
                        <TouchableOpacity
                          key={wallet.id}
                          style={[
                            styles.walletOption,
                            isSelected && styles.walletOptionSelected,
                          ]}
                          onPress={() => setTargetWalletId(wallet.id)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.walletIconCircle,
                              { backgroundColor: `${wallet.color}25` },
                            ]}
                          >
                            <Ionicons
                              name={(wallet.icon as any) || 'wallet'}
                              size={16}
                              color={wallet.color}
                            />
                          </View>
                          <View>
                            <Text
                              style={[
                                styles.walletOptionName,
                                isSelected && styles.walletOptionNameSelected,
                              ]}
                              numberOfLines={1}
                            >
                              {wallet.name}
                            </Text>
                            <Text style={styles.walletOptionBalance}>
                              {formatRupiah(wallet.balance, isPrivacyMode)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </>
            )}

            {/* Categories (If Expense or Income) */}
            {type !== 'transfer' && (
              <>
                <View style={styles.categoryHeaderRow}>
                  <Text style={styles.inputLabel}>PILIH KATEGORI</Text>
                  <TouchableOpacity
                    style={styles.addCategoryBtn}
                    onPress={() => setShowAddCategoryModal(true)}
                  >
                    <Ionicons name="add-circle" size={14} color={Colors.primaryLight} />
                    <Text style={styles.addCategoryBtnText}>+ Kategori Baru</Text>
                  </TouchableOpacity>
                </View>

                {/* Categories Grid */}
                <View style={styles.categoriesGrid}>
                  {availableCategories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryPill,
                          isSelected && {
                            borderColor: cat.color,
                            backgroundColor: `${cat.color}22`,
                          },
                        ]}
                        onPress={() => setSelectedCategoryId(cat.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={(cat.icon as any) || 'pricetag'}
                          size={16}
                          color={cat.color}
                        />
                        <Text
                          style={[
                            styles.categoryPillText,
                            isSelected && { color: Colors.textPrimary, fontWeight: Typography.weights.bold },
                          ]}
                          numberOfLines={1}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* Optional Note / Catatan */}
            <Text style={styles.inputLabel}>CATATAN (OPSIONAL)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder={
                  type === 'expense'
                    ? 'misal: Belanja telur & beras, Kopi Kenangan...'
                    : 'misal: Bonus project, Gaji pokok...'
                }
                placeholderTextColor={Colors.textTertiary}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Simplified Date Selection */}
            <Text style={styles.inputLabel}>TANGGAL TRANSAKSI</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={[
                  styles.dateChip,
                  dateOption === 'today' && styles.dateChipActive,
                ]}
                onPress={() => {
                  setDateOption('today');
                  setCustomDate(toDateString(new Date()));
                }}
              >
                <Text
                  style={[
                    styles.dateChipText,
                    dateOption === 'today' && styles.dateChipTextActive,
                  ]}
                >
                  Hari Ini
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateChip,
                  dateOption === 'yesterday' && styles.dateChipActive,
                ]}
                onPress={() => {
                  setDateOption('yesterday');
                  const y = new Date();
                  y.setDate(y.getDate() - 1);
                  setCustomDate(toDateString(y));
                }}
              >
                <Text
                  style={[
                    styles.dateChipText,
                    dateOption === 'yesterday' && styles.dateChipTextActive,
                  ]}
                >
                  Kemarin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateChip,
                  dateOption === 'custom' && styles.dateChipActive,
                ]}
                onPress={() => {
                  setDateOption('custom');
                }}
              >
                <Text
                  style={[
                    styles.dateChipText,
                    dateOption === 'custom' && styles.dateChipTextActive,
                  ]}
                >
                  2 Hari Lalu
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Day Shift Bar */}
            <View style={styles.dayShiftBar}>
              <TouchableOpacity
                style={styles.dayShiftBtn}
                onPress={() => {
                  setDateOption('custom');
                  adjustCustomDate('day', -1);
                }}
              >
                <Ionicons name="chevron-back" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>

              <View style={styles.dayDisplay}>
                <Ionicons name="calendar-outline" size={14} color={Colors.primaryLight} />
                <Text style={styles.dayDisplayText}>
                  {formatDateIndonesian(customDate, { showDay: true })}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.dayShiftBtn}
                onPress={() => {
                  setDateOption('custom');
                  adjustCustomDate('day', 1);
                }}
              >
                <Ionicons name="chevron-forward" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.saveBtn,
              type === 'expense' && { backgroundColor: Colors.expense },
              type === 'income' && { backgroundColor: Colors.income },
              type === 'transfer' && { backgroundColor: Colors.transfer },
              isSubmitting && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            <Text style={styles.saveBtnText}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Category Modal */}
      <AddCategoryModal
        visible={showAddCategoryModal}
        initialType={type === 'income' ? 'income' : 'expense'}
        onClose={() => setShowAddCategoryModal(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    width: '100%',
    maxWidth: 480,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  typeTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 4,
    gap: 4,
    marginBottom: Spacing.md,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: Radius.md,
    gap: 4,
  },
  typeTabActiveExpense: {
    backgroundColor: Colors.expense,
  },
  typeTabActiveIncome: {
    backgroundColor: Colors.income,
  },
  typeTabActiveTransfer: {
    backgroundColor: Colors.transfer,
  },
  typeTabText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  typeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  scrollBody: {
    maxHeight: 480,
  },
  amountBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.sm,
  },
  currencyLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  rpSign: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.heavy,
    color: Colors.textTertiary,
    marginRight: Spacing.xs,
  },
  amountInput: {
    flex: 1,
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    padding: 0,
    letterSpacing: -0.5,
  },
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.xs,
  },
  quickChip: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  resetChip: {
    paddingHorizontal: 8,
  },
  quickChipText: {
    fontSize: 11,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  inputLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  walletPickerRow: {
    gap: Spacing.xs,
    paddingVertical: 2,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.xs,
  },
  walletOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  walletIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletOptionName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  walletOptionNameSelected: {
    color: Colors.primaryLight,
  },
  walletOptionBalance: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  addCategoryBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 6,
  },
  categoryPillText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
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
  dateRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
    flexWrap: 'wrap',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: 6,
  },
  dateChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  dateChipTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  calendarBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  dayShiftBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  dayShiftBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayDisplayText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: '#000',
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

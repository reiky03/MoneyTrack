import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { useAlert } from '../context/AlertContext';
import { Transaction, TransactionType, Category } from '../types';
import {
  formatNumberWithDots,
  parseCurrencyInput,
  formatRupiah,
} from '../utils/formatters';
import { AddCategoryModal } from './AddCategoryModal';
import { formatDateIndonesian, toDateString } from '../utils/dateUtils';
import { useSmoothKeyboard } from '../hooks/useSmoothKeyboard';

interface EditTransactionModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

const QUICK_AMOUNTS = [
  { label: '+10rb', value: 10000 },
  { label: '+25rb', value: 25000 },
  { label: '+50rb', value: 50000 },
  { label: '+100rb', value: 100000 },
  { label: '+500rb', value: 500000 },
];

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  visible,
  transaction,
  onClose,
}) => {
  const {
    wallets,
    categories,
    updateTransaction,
    deleteTransaction,
    isPrivacyMode,
  } = useMoney();

  const { showAlert, showConfirm } = useAlert();

  const [type, setType] = useState<TransactionType>('expense');
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

  useSmoothKeyboard();

  // Sync state when transaction changes or modal opens
  useEffect(() => {
    if (visible && transaction) {
      setType(transaction.type);
      setAmountText(formatNumberWithDots(transaction.amount));
      setSelectedWalletId(transaction.walletId);
      setTargetWalletId(transaction.toWalletId || '');
      setSelectedCategoryId(transaction.categoryId || '');
      setNote(transaction.note || '');

      // Parse transaction date
      try {
        const txDate = new Date(transaction.date);
        const todayStr = toDateString(new Date());
        const txDateStr = toDateString(txDate);

        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yesterdayStr = toDateString(y);

        if (txDateStr === todayStr) {
          setDateOption('today');
        } else if (txDateStr === yesterdayStr) {
          setDateOption('yesterday');
        } else {
          setDateOption('custom');
          setCustomDate(txDateStr);
        }
      } catch {
        setDateOption('today');
      }
      setShowDatePicker(false);
    }
  }, [visible, transaction]);

  if (!transaction) return null;

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
        message: 'Nominal transaksi harus lebih dari 0.',
        type: 'warning',
      });
      return;
    }

    if (!selectedWalletId) {
      showAlert({
        title: 'Perhatian',
        message: 'Silakan pilih sumber dana terlebih dahulu.',
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
        message: 'Pilih kategori transaksi terlebih dahulu.',
        type: 'warning',
      });
      return;
    }

    // Determine final ISO date
    let finalDateIso = transaction.date;
    if (dateOption === 'today') {
      finalDateIso = new Date().toISOString();
    } else if (dateOption === 'yesterday') {
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
      const updatedTx: Transaction = {
        ...transaction,
        type,
        amount: numericAmount,
        walletId: selectedWalletId,
        toWalletId: type === 'transfer' ? targetWalletId : undefined,
        categoryId: type !== 'transfer' ? selectedCategoryId : undefined,
        note: note.trim() || undefined,
        date: finalDateIso,
      };

      await updateTransaction(updatedTx);
      onClose();
    } catch {
      showAlert({
        title: 'Gagal',
        message: 'Terjadi kesalahan saat memperbarui transaksi.',
        type: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    showConfirm({
      title: 'Hapus Transaksi',
      message: `Yakin ingin menghapus transaksi senilai ${formatRupiah(transaction.amount)}? Saldo dompet akan disesuaikan otomatis.`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: async () => {
        await deleteTransaction(transaction.id);
        onClose();
      },
    });
  };

  const availableCategories = categories.filter((c) =>
    type === 'income' ? c.type === 'income' : c.type === 'expense'
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
          />
          <View style={styles.container}>
            {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Edit Transaksi</Text>
              <Text style={styles.headerSub}>Ubah nominal, sumber uang, atau detail lainnya</Text>
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.scroll}
          >
            {/* Type Switcher */}
            <View style={styles.typeSwitcher}>
              <TouchableOpacity
                style={[
                  styles.typeTab,
                  type === 'expense' && styles.typeTabExpense,
                ]}
                onPress={() => handleTypeChange('expense')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={15}
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
                  type === 'income' && styles.typeTabIncome,
                ]}
                onPress={() => handleTypeChange('income')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={15}
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
                  type === 'transfer' && styles.typeTabTransfer,
                ]}
                onPress={() => handleTypeChange('transfer')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={15}
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

            {/* Currency Input Field */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>NOMINAL TRANSAKSI</Text>
              <View style={styles.amountRow}>
                <Text style={styles.currencySymbol}>Rp</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                  value={amountText}
                  onChangeText={handleAmountChange}
                />
              </View>

              {/* Quick Increment Chips */}
              <View style={styles.quickChipsRow}>
                {QUICK_AMOUNTS.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.quickChip}
                    onPress={() => addQuickAmount(item.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickChipText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Selector */}
            <Text style={styles.sectionTitle}>WAKTU TRANSAKSI</Text>
            <View style={styles.dateOptionRow}>
              <TouchableOpacity
                style={[
                  styles.dateOptionBtn,
                  dateOption === 'today' && styles.dateOptionBtnActive,
                ]}
                onPress={() => {
                  setDateOption('today');
                  setShowDatePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    dateOption === 'today' && styles.dateOptionTextActive,
                  ]}
                >
                  Hari Ini
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateOptionBtn,
                  dateOption === 'yesterday' && styles.dateOptionBtnActive,
                ]}
                onPress={() => {
                  setDateOption('yesterday');
                  setShowDatePicker(false);
                }}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    dateOption === 'yesterday' && styles.dateOptionTextActive,
                  ]}
                >
                  Kemarin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateOptionBtn,
                  dateOption === 'custom' && styles.dateOptionBtnActive,
                ]}
                onPress={() => {
                  setDateOption('custom');
                  setShowDatePicker(!showDatePicker);
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={dateOption === 'custom' ? Colors.primaryLight : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.dateOptionText,
                    dateOption === 'custom' && styles.dateOptionTextActive,
                  ]}
                >
                  {dateOption === 'custom'
                    ? formatDateIndonesian(customDate, { shortMonth: true })
                    : 'Pilih Tanggal'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Custom Date Stepper */}
            {dateOption === 'custom' && showDatePicker && (
              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerLabel}>Atur Tanggal Transaksi:</Text>
                <View style={styles.stepperRow}>
                  {/* Day Stepper */}
                  <View style={styles.stepperCol}>
                    <Text style={styles.stepperLabel}>HARI</Text>
                    <View style={styles.stepperControl}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => adjustCustomDate('day', -1)}
                      >
                        <Ionicons name="remove" size={16} color={Colors.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.stepVal}>
                        {customDate.split('-')[2]}
                      </Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => adjustCustomDate('day', 1)}
                      >
                        <Ionicons name="add" size={16} color={Colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Month Stepper */}
                  <View style={styles.stepperCol}>
                    <Text style={styles.stepperLabel}>BULAN</Text>
                    <View style={styles.stepperControl}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => adjustCustomDate('month', -1)}
                      >
                        <Ionicons name="remove" size={16} color={Colors.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.stepVal}>
                        {customDate.split('-')[1]}
                      </Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => adjustCustomDate('month', 1)}
                      >
                        <Ionicons name="add" size={16} color={Colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Year Stepper */}
                  <View style={styles.stepperCol}>
                    <Text style={styles.stepperLabel}>TAHUN</Text>
                    <View style={styles.stepperControl}>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => adjustCustomDate('year', -1)}
                      >
                        <Ionicons name="remove" size={16} color={Colors.textPrimary} />
                      </TouchableOpacity>
                      <Text style={styles.stepVal}>
                        {customDate.split('-')[0]}
                      </Text>
                      <TouchableOpacity
                        style={styles.stepBtn}
                        onPress={() => adjustCustomDate('year', 1)}
                      >
                        <Ionicons name="add" size={16} color={Colors.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Source Wallet Selection */}
            <Text style={styles.sectionTitle}>
              {type === 'transfer' ? 'DARI SUMBER UANG' : 'SUMBER UANG'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.walletsScroll}
            >
              {wallets.map((wallet) => {
                const isSelected = selectedWalletId === wallet.id;
                return (
                  <TouchableOpacity
                    key={wallet.id}
                    style={[
                      styles.walletItem,
                      isSelected && styles.walletItemSelected,
                    ]}
                    onPress={() => setSelectedWalletId(wallet.id)}
                    activeOpacity={0.8}
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
                    <Text
                      style={[
                        styles.walletName,
                        isSelected && styles.walletNameSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {wallet.name}
                    </Text>
                    <Text style={styles.walletBalance} numberOfLines={1}>
                      {formatRupiah(wallet.balance, isPrivacyMode)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Transfer Target Wallet */}
            {type === 'transfer' && (
              <>
                <Text style={styles.sectionTitle}>TRANSFER KE DOMPET TUJUAN</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.walletsScroll}
                >
                  {wallets
                    .filter((w) => w.id !== selectedWalletId)
                    .map((wallet) => {
                      const isSelected = targetWalletId === wallet.id;
                      return (
                        <TouchableOpacity
                          key={wallet.id}
                          style={[
                            styles.walletItem,
                            isSelected && styles.walletItemSelected,
                          ]}
                          onPress={() => setTargetWalletId(wallet.id)}
                          activeOpacity={0.8}
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
                          <Text
                            style={[
                              styles.walletName,
                              isSelected && styles.walletNameSelected,
                            ]}
                            numberOfLines={1}
                          >
                            {wallet.name}
                          </Text>
                          <Text style={styles.walletBalance} numberOfLines={1}>
                            {formatRupiah(wallet.balance, isPrivacyMode)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                </ScrollView>
              </>
            )}

            {/* Category Selection (Non-Transfer) */}
            {type !== 'transfer' && (
              <>
                <View style={styles.categoryHeaderRow}>
                  <Text style={styles.sectionTitle}>KATEGORI</Text>
                  <TouchableOpacity
                    style={styles.addCategoryBtn}
                    onPress={() => setShowAddCategoryModal(true)}
                  >
                    <Ionicons name="add" size={14} color={Colors.primaryLight} />
                    <Text style={styles.addCategoryText}>Tambah Kategori</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.categoryGrid}>
                  {availableCategories.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.catItem,
                          isSelected && styles.catItemSelected,
                        ]}
                        onPress={() => setSelectedCategoryId(cat.id)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.catIconWrap,
                            { backgroundColor: `${cat.color}20` },
                            isSelected && { backgroundColor: cat.color },
                          ]}
                        >
                          <Ionicons
                            name={(cat.icon as any) || 'pricetag'}
                            size={18}
                            color={isSelected ? '#FFFFFF' : cat.color}
                          />
                        </View>
                        <Text
                          style={[
                            styles.catText,
                            isSelected && styles.catTextSelected,
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

            {/* Note Field */}
            <Text style={styles.sectionTitle}>CATATAN (OPSIONAL)</Text>
            <View style={styles.noteInputWrap}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={Colors.textTertiary}
              />
              <TextInput
                style={styles.noteInput}
                placeholder="misal: Beli telur di Indomaret, gaji bulanan..."
                placeholderTextColor={Colors.textTertiary}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                isSubmitting && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Add Category Submodal */}
      <AddCategoryModal
        visible={showAddCategoryModal}
        initialType={type === 'income' ? 'income' : 'expense'}
        onClose={() => setShowAddCategoryModal(false)}
        onCategoryCreated={(newCat) => setSelectedCategoryId(newCat.id)}
      />
    </KeyboardAvoidingView>
  </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    maxHeight: '92%',
    paddingBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    width: '100%',
    maxWidth: 480,
    flexShrink: 1,
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
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  headerSub: {
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
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 3,
    marginBottom: Spacing.md,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 9,
    borderRadius: Radius.md,
  },
  typeTabExpense: {
    backgroundColor: Colors.expense,
  },
  typeTabIncome: {
    backgroundColor: Colors.income,
  },
  typeTabTransfer: {
    backgroundColor: Colors.transfer,
  },
  typeTabText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  typeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  amountBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  currencySymbol: {
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
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  quickChip: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  quickChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  dateOptionRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  dateOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  dateOptionBtnActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: Colors.primary,
  },
  dateOptionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  dateOptionTextActive: {
    color: Colors.primaryLight,
    fontWeight: Typography.weights.bold,
  },
  datePickerContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  datePickerLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  stepperCol: {
    flex: 1,
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 9,
    color: Colors.textTertiary,
    marginBottom: 4,
    fontWeight: Typography.weights.bold,
  },
  stepperControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.md,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 6,
  },
  stepBtn: {
    padding: 4,
  },
  stepVal: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    minWidth: 28,
    textAlign: 'center',
  },
  walletsScroll: {
    gap: Spacing.sm,
    paddingVertical: 4,
    marginBottom: Spacing.sm,
  },
  walletItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    minWidth: 120,
  },
  walletItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  walletIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  walletName: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  walletNameSelected: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.bold,
  },
  walletBalance: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  addCategoryText: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  catItem: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  catText: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  catTextSelected: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.bold,
  },
  noteInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.lg,
  },
  noteInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.sizes.sm,
    padding: 0,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
});

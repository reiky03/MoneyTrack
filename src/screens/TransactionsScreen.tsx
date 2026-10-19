import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { TransactionItem } from '../components/TransactionItem';
import { TransactionType } from '../types';
import { formatRupiah } from '../utils/formatters';

interface TransactionsScreenProps {
  onAddPress: () => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ onAddPress }) => {
  const { filteredTransactions, categories, wallets, isPrivacyMode } = useMoney();

  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterWalletId, setFilterWalletId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  // Selected wallet object
  const selectedWallet = wallets.find((w) => w.id === filterWalletId);

  // Filtering
  const displayed = filteredTransactions.filter((tx) => {
    // Type match
    if (filterType !== 'all' && tx.type !== filterType) return false;

    // Wallet match
    if (
      filterWalletId !== 'all' &&
      tx.walletId !== filterWalletId &&
      tx.toWalletId !== filterWalletId
    ) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const noteMatch = tx.note?.toLowerCase().includes(q);
      const category = categories.find((c) => c.id === tx.categoryId);
      const catMatch = category?.name.toLowerCase().includes(q);
      if (!noteMatch && !catMatch) return false;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Riwayat Transaksi</Text>
          <Text style={styles.subtitle}>
            {displayed.length} Transaksi ditemukan
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={onAddPress}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Catat</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari transaksi (cth: belanja telur, bensin)..."
          placeholderTextColor={Colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Row 1: Segmented Type Filter (Hanya Semua, Keluar, Masuk) */}
      <View style={styles.typeSegmentWrapper}>
        <View style={styles.typeSegmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              filterType === 'all' && styles.segmentBtnActiveAll,
            ]}
            onPress={() => setFilterType('all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === 'all' && styles.segmentTextActive,
              ]}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              filterType === 'expense' && styles.segmentBtnActiveExpense,
            ]}
            onPress={() => setFilterType('expense')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === 'expense' && styles.segmentTextActive,
              ]}
            >
              Keluar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              filterType === 'income' && styles.segmentBtnActiveIncome,
            ]}
            onPress={() => setFilterType('income')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                filterType === 'income' && styles.segmentTextActive,
              ]}
            >
              Masuk
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2: Single Simple Filter Dropdown Pill */}
      <View style={styles.filterBarRow}>
        <TouchableOpacity
          style={[
            styles.filterDropdownBtn,
            filterWalletId !== 'all' && styles.filterDropdownBtnActive,
          ]}
          onPress={() => setShowWalletModal(true)}
          activeOpacity={0.75}
        >
          <Ionicons
            name="funnel-outline"
            size={13}
            color={filterWalletId !== 'all' ? Colors.primaryLight : Colors.textSecondary}
          />
          <Text
            style={[
              styles.filterDropdownText,
              filterWalletId !== 'all' && styles.filterDropdownTextActive,
            ]}
          >
            {selectedWallet ? selectedWallet.name : 'Filter Dompet: Semua'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={13}
            color={filterWalletId !== 'all' ? Colors.primaryLight : Colors.textTertiary}
          />
        </TouchableOpacity>

        {filterWalletId !== 'all' && (
          <TouchableOpacity
            style={styles.resetFilterBtn}
            onPress={() => setFilterWalletId('all')}
            activeOpacity={0.7}
          >
            <Text style={styles.resetFilterText}>Reset</Text>
            <Ionicons name="close" size={13} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Transaction List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {displayed.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>Tidak ada transaksi</Text>
            <Text style={styles.emptySubtitle}>
              Coba sesuaikan filter atau tambahkan transaksi baru.
            </Text>
          </View>
        ) : (
          displayed.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))
        )}

        {/* Space for bottom navbar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Modal Filter Dompet */}
      <Modal
        visible={showWalletModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWalletModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowWalletModal(false)}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Sumber Dompet</Text>
              <TouchableOpacity onPress={() => setShowWalletModal(false)}>
                <Ionicons name="close" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.modalOption,
                filterWalletId === 'all' && styles.modalOptionActive,
              ]}
              onPress={() => {
                setFilterWalletId('all');
                setShowWalletModal(false);
              }}
            >
              <View style={styles.modalOptionLeft}>
                <Ionicons
                  name="layers-outline"
                  size={18}
                  color={filterWalletId === 'all' ? Colors.primaryLight : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.modalOptionText,
                    filterWalletId === 'all' && styles.modalOptionTextActive,
                  ]}
                >
                  Semua Dompet
                </Text>
              </View>
              {filterWalletId === 'all' && (
                <Ionicons name="checkmark" size={16} color={Colors.primaryLight} />
              )}
            </TouchableOpacity>

            {wallets.map((w) => {
              const isSelected = filterWalletId === w.id;
              return (
                <TouchableOpacity
                  key={w.id}
                  style={[
                    styles.modalOption,
                    isSelected && styles.modalOptionActive,
                  ]}
                  onPress={() => {
                    setFilterWalletId(w.id);
                    setShowWalletModal(false);
                  }}
                >
                  <View style={styles.modalOptionLeft}>
                    <Ionicons
                      name={(w.icon as any) || 'wallet'}
                      size={18}
                      color={w.color}
                    />
                    <View>
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextActive,
                        ]}
                      >
                        {w.name}
                      </Text>
                      <Text style={styles.modalOptionSub}>
                        Saldo: {formatRupiah(w.balance, isPrivacyMode)}
                      </Text>
                    </View>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color={Colors.primaryLight} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.sizes.sm,
    paddingVertical: 0,
  },

  // Segmented Type Filter (Semua, Keluar, Masuk)
  typeSegmentWrapper: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  typeSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: Radius.md,
  },
  segmentBtnActiveAll: {
    backgroundColor: Colors.primary,
  },
  segmentBtnActiveExpense: {
    backgroundColor: Colors.expense,
  },
  segmentBtnActiveIncome: {
    backgroundColor: Colors.income,
  },
  segmentText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },

  // Single Filter Dropdown Bar
  filterBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
    marginTop: 2,
  },
  filterDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  filterDropdownBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  filterDropdownText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  filterDropdownTextActive: {
    color: Colors.primaryLight,
    fontWeight: Typography.weights.bold,
  },
  resetFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  resetFilterText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: 4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  modalOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  modalOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  modalOptionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  modalOptionTextActive: {
    color: Colors.primaryLight,
    fontWeight: Typography.weights.bold,
  },
  modalOptionSub: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 1,
  },

  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xs,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});

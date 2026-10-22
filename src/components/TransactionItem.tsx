import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { useAlert } from '../context/AlertContext';
import { Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';
import { formatDateIndonesian } from '../utils/dateUtils';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  onEdit?: (transaction: Transaction) => void;
  showOnlyTime?: boolean;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  onEdit,
  showOnlyTime,
}) => {
  const { categories, wallets, deleteTransaction, isPrivacyMode } = useMoney();

  const category = categories.find((c) => c.id === transaction.categoryId);
  const sourceWallet = wallets.find((w) => w.id === transaction.walletId);
  const targetWallet = wallets.find((w) => w.id === transaction.toWalletId);

  const isIncome = transaction.type === 'income';
  const isTransfer = transaction.type === 'transfer';

  const amountColor = isIncome
    ? Colors.income
    : isTransfer
    ? Colors.transfer
    : Colors.expense;

  const amountPrefix = isIncome ? '+' : isTransfer ? '' : '-';

  const iconName = isTransfer
    ? 'swap-horizontal'
    : (category?.icon as any) || 'pricetag';

  const iconColor = isTransfer
    ? Colors.transfer
    : category?.color || Colors.primary;

  const title = isTransfer
    ? `Transfer ke ${targetWallet?.name || 'Akun'}`
    : category?.name || 'Lainnya';

  const { showConfirm } = useAlert();

  const handleDelete = () => {
    showConfirm({
      title: 'Hapus Transaksi',
      message: `Yakin ingin menghapus transaksi ${title} sebesar ${formatRupiah(
        transaction.amount
      )}? Saldo dompet akan otomatis disesuaikan.`,
      confirmText: 'Hapus',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: () => deleteTransaction(transaction.id),
    });
  };

  const handleItemPress = () => {
    if (onPress) {
      onPress();
    } else if (onEdit) {
      onEdit(transaction);
    }
  };

  let timeStr = '';
  if (transaction.date && transaction.date.includes('T')) {
    const raw = new Date(transaction.date);
    if (!isNaN(raw.getTime())) {
      const h = String(raw.getHours()).padStart(2, '0');
      const m = String(raw.getMinutes()).padStart(2, '0');
      timeStr = `${h}:${m}`;
    }
  }

  const dateDisplay = showOnlyTime && timeStr
    ? timeStr
    : formatDateIndonesian(transaction.date, { showTime: true, shortMonth: true });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleItemPress}
      onLongPress={handleDelete}
      activeOpacity={0.7}
    >
      {/* Icon Circle */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: `${iconColor}18` },
        ]}
      >
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>

      {/* Main Info */}
      <View style={styles.infoCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Note if present */}
        {transaction.note ? (
          <Text style={styles.note} numberOfLines={1}>
            {transaction.note}
          </Text>
        ) : null}

        {/* Source wallet + date tag */}
        <View style={styles.metaRow}>
          <View style={styles.walletTag}>
            <Ionicons
              name={(sourceWallet?.icon as any) || 'wallet-outline'}
              size={11}
              color={Colors.textTertiary}
            />
            <Text style={styles.walletTagText} numberOfLines={1}>
              {sourceWallet?.name || 'Dompet'}
            </Text>
          </View>

          <Text style={styles.dateText}>
            {dateDisplay}
          </Text>
        </View>
      </View>

      {/* Amount & Actions */}
      <View style={styles.rightCol}>
        <Text style={[styles.amount, { color: amountColor }]} numberOfLines={1}>
          {amountPrefix}
          {formatRupiah(transaction.amount, isPrivacyMode)}
        </Text>

        <View style={styles.actionButtons}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onEdit(transaction)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="create-outline" size={14} color={Colors.primaryLight} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={14} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoCol: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  note: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  walletTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  walletTagText: {
    fontSize: 10,
    color: Colors.textTertiary,
    maxWidth: 90,
  },
  dateText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  amount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 4,
  },
  actionBtn: {
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: Radius.sm,
  },
});

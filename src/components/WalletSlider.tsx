import React from 'react';
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
import { Wallet } from '../types';
import { formatRupiah } from '../utils/formatters';

interface WalletSliderProps {
  onAddWalletPress: () => void;
  onWalletManagePress?: (wallet: Wallet) => void;
}

export const WalletSlider: React.FC<WalletSliderProps> = ({
  onAddWalletPress,
  onWalletManagePress,
}) => {
  const {
    wallets,
    selectedWalletId,
    setSelectedWalletId,
    isPrivacyMode,
  } = useMoney();

  const handleWalletPress = (walletId: string) => {
    if (selectedWalletId === walletId) {
      // Toggle off filter if clicked again
      setSelectedWalletId(null);
    } else {
      setSelectedWalletId(walletId);
    }
  };

  const getWalletTypeLabel = (type: Wallet['type']) => {
    switch (type) {
      case 'bank':
        return 'BANK';
      case 'cash':
        return 'TUNAI';
      case 'ewallet':
        return 'E-WALLET';
      case 'investment':
        return 'INVESTASI';
      default:
        return 'AKUN';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Text style={styles.sectionTitle}>Dompet & Sumber Uang</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{wallets.length}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddWalletPress}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color={Colors.primaryLight} />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Cards Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* "Semua Akun" Reset Card */}
        <TouchableOpacity
          style={[
            styles.allCard,
            selectedWalletId === null && styles.allCardActive,
          ]}
          onPress={() => setSelectedWalletId(null)}
          activeOpacity={0.75}
        >
          <View
            style={[
              styles.allIconContainer,
              selectedWalletId === null && styles.allIconContainerActive,
            ]}
          >
            <Ionicons
              name="layers-outline"
              size={18}
              color={selectedWalletId === null ? '#FFFFFF' : Colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.allCardText,
              selectedWalletId === null && styles.allCardTextActive,
            ]}
          >
            Semua
          </Text>
        </TouchableOpacity>

        {/* Dynamic Wallet Cards */}
        {wallets.map((wallet) => {
          const isSelected = selectedWalletId === wallet.id;

          return (
            <TouchableOpacity
              key={wallet.id}
              style={[
                styles.walletCard,
                isSelected && styles.walletCardSelected,
              ]}
              onPress={() => handleWalletPress(wallet.id)}
              onLongPress={() => onWalletManagePress && onWalletManagePress(wallet)}
              activeOpacity={0.8}
            >
              {/* Top Row: Icon + Type Badge */}
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.walletIconContainer,
                    { backgroundColor: `${wallet.color}22` },
                  ]}
                >
                  <Ionicons
                    name={(wallet.icon as any) || 'wallet'}
                    size={18}
                    color={wallet.color}
                  />
                </View>

                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>
                    {getWalletTypeLabel(wallet.type)}
                  </Text>
                </View>
              </View>

              {/* Wallet Name */}
              <Text style={styles.walletName} numberOfLines={1}>
                {wallet.name}
              </Text>

              {/* Balance */}
              <Text
                style={[
                  styles.walletBalance,
                  wallet.balance < 0 && { color: Colors.expense },
                ]}
                numberOfLines={1}
              >
                {formatRupiah(wallet.balance, isPrivacyMode)}
              </Text>

              {/* Active selection dot indicator */}
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.primaryLight} />
                  <Text style={styles.selectedIndicatorText}>Terpilih</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  countText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  addButtonText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xs,
    gap: Spacing.md,
  },
  allCard: {
    width: 80,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    minHeight: 110,
  },
  allCardActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  allIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  allIconContainerActive: {
    backgroundColor: Colors.primary,
  },
  allCardText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  allCardTextActive: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.bold,
  },
  walletCard: {
    width: 175,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  walletCardSelected: {
    borderColor: Colors.primaryLight,
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  walletIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.heavy,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  },
  walletName: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    marginTop: 4,
  },
  walletBalance: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.bold,
    marginTop: 2,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  selectedIndicatorText: {
    fontSize: 10,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
});

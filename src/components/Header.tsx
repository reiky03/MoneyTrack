import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { formatDateIndonesian } from '../utils/dateUtils';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenWallets?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenWallets }) => {
  const { isPrivacyMode, togglePrivacyMode } = useMoney();
  const todayStr = formatDateIndonesian(new Date(), { showDay: true, shortMonth: true });

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>MoneyTrack</Text>
          <Text style={styles.date}>{todayStr}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Privacy Toggle Button */}
        <TouchableOpacity
          style={[styles.iconButton, isPrivacyMode && styles.iconButtonActive]}
          onPress={togglePrivacyMode}
          activeOpacity={0.7}
          accessibilityLabel="Toggle mode privasi saldo"
        >
          <Ionicons
            name={isPrivacyMode ? 'eye-off' : 'eye'}
            size={19}
            color={isPrivacyMode ? Colors.primaryLight : Colors.textSecondary}
          />
        </TouchableOpacity>

        {/* Manage Wallets Button */}
        {onOpenWallets && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenWallets}
            activeOpacity={0.7}
            accessibilityLabel="Kelola Dompet & Akun"
          >
            <Ionicons name="wallet-outline" size={19} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginTop: 2,
    fontWeight: Typography.weights.medium,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: Colors.primary,
  },
});

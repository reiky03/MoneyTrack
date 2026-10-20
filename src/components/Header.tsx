import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Updates from 'expo-updates';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, APP_VERSION } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { useAlert } from '../context/AlertContext';
import { formatDateIndonesian } from '../utils/dateUtils';
import { UpdatePromptModal } from './UpdatePromptModal';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenWallets?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenWallets }) => {
  const { isPrivacyMode, togglePrivacyMode } = useMoney();
  const { showAlert } = useAlert();
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [manualCheckTrigger, setManualCheckTrigger] = useState(0);

  const todayStr = formatDateIndonesian(new Date(), { showDay: true, shortMonth: true });

  const handleCheckUpdate = async () => {
    if (!Updates.isEnabled) {
      showAlert({
        title: `MoneyTrack ${APP_VERSION} 🎉`,
        message: 'Aplikasi kamu saat ini sudah menggunakan versi paling mutakhir (v1.2.0).',
        type: 'info',
      });
      return;
    }

    try {
      setIsCheckingUpdate(true);
      const check = await Updates.checkForUpdateAsync();
      if (check.isAvailable) {
        setManualCheckTrigger((c) => c + 1);
      } else {
        showAlert({
          title: 'Versi Terkini 🎉',
          message: `Aplikasi kamu sudah menggunakan pembaruan terbaru (${APP_VERSION}). Belum ada update baru.`,
          type: 'info',
        });
      }
    } catch {
      showAlert({
        title: 'Gagal Memeriksa',
        message: 'Tidak dapat memeriksa pembaruan. Pastikan perangkatmu terhubung ke internet ya beb.',
        type: 'warning',
      });
    } finally {
      setIsCheckingUpdate(false);
    }
  };

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
        {/* App Version & OTA Update Check Badge */}
        <TouchableOpacity
          style={styles.versionPill}
          onPress={handleCheckUpdate}
          disabled={isCheckingUpdate}
          activeOpacity={0.7}
          accessibilityLabel={`Versi aplikasi ${APP_VERSION}. Ketuk untuk memeriksa pembaruan.`}
        >
          {isCheckingUpdate ? (
            <ActivityIndicator size="small" color={Colors.primaryLight} style={{ transform: [{ scale: 0.75 }] }} />
          ) : (
            <Ionicons name="cloud-download-outline" size={13} color={Colors.primaryLight} />
          )}
          <Text style={styles.versionPillText}>{APP_VERSION}</Text>
        </TouchableOpacity>

        {/* Privacy Toggle Button */}
        <TouchableOpacity
          style={[styles.iconButton, isPrivacyMode && styles.iconButtonActive]}
          onPress={togglePrivacyMode}
          activeOpacity={0.7}
          accessibilityLabel="Toggle mode privasi saldo"
        >
          <Ionicons
            name={isPrivacyMode ? 'eye-off' : 'eye'}
            size={18}
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
            <Ionicons name="wallet-outline" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Manual Check Update Modal */}
      <UpdatePromptModal manualCheckTrigger={manualCheckTrigger} />
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
  versionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  versionPillText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryLight,
    letterSpacing: 0.3,
  },
  iconButton: {
    width: 36,
    height: 36,
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

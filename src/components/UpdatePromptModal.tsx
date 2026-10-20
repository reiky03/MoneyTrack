import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Updates from 'expo-updates';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface UpdatePromptModalProps {
  // Optional manual trigger control
  manualCheckTrigger?: number;
  onManualCheckResult?: (available: boolean) => void;
}

export const UpdatePromptModal: React.FC<UpdatePromptModalProps> = ({
  manualCheckTrigger,
  onManualCheckResult,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusText, setStatusText] = useState('Perbarui Sekarang');

  // Check for updates on mount
  useEffect(() => {
    let isMounted = true;

    const checkUpdate = async () => {
      // In development / Expo Go, Updates.isEnabled is false
      if (!Updates.isEnabled) {
        return;
      }

      try {
        // Small delay to let initial UI render smoothly
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const result = await Updates.checkForUpdateAsync();
        if (isMounted && result.isAvailable) {
          setModalVisible(true);
        }
      } catch {
        // Silently catch network or offline errors
      }
    };

    checkUpdate();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle manual check trigger (e.g. from Settings / Wallets screen)
  useEffect(() => {
    if (manualCheckTrigger === undefined || manualCheckTrigger === 0) return;

    let isMounted = true;
    const runManualCheck = async () => {
      if (!Updates.isEnabled) {
        if (onManualCheckResult) onManualCheckResult(false);
        return;
      }

      try {
        const result = await Updates.checkForUpdateAsync();
        if (isMounted) {
          if (result.isAvailable) {
            setModalVisible(true);
            if (onManualCheckResult) onManualCheckResult(true);
          } else {
            if (onManualCheckResult) onManualCheckResult(false);
          }
        }
      } catch {
        if (isMounted && onManualCheckResult) onManualCheckResult(false);
      }
    };

    runManualCheck();

    return () => {
      isMounted = false;
    };
  }, [manualCheckTrigger]);

  const handleApplyUpdate = async () => {
    try {
      setIsUpdating(true);
      setStatusText('Mengunduh pembaruan...');

      // Fetch update bundle
      await Updates.fetchUpdateAsync();

      setStatusText('Menerapkan pembaruan...');
      // Small pause for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Reload app to apply update
      await Updates.reloadAsync();
    } catch {
      setIsUpdating(false);
      setStatusText('Perbarui Sekarang');
      setModalVisible(false);
    }
  };

  const handleDismiss = () => {
    if (isUpdating) return;
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Glowing Icon Badge */}
          <View style={styles.iconContainer}>
            <View style={styles.iconGlow} />
            <View style={styles.iconBadge}>
              <Ionicons name="sparkles" size={26} color="#FFFFFF" />
            </View>
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>Pembaruan Tersedia! 🚀</Text>
          <Text style={styles.description}>
            Versi terbaru MoneyTrack sudah siap dengan perbaikan dan peningkatan fitur baru.
            Apakah kamu ingin memperbaruinya sekarang?
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleDismiss}
              disabled={isUpdating}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Nanti Saja</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.updateBtn, isUpdating && styles.updateBtnDisabled]}
              onPress={handleApplyUpdate}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              {isUpdating ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.updateBtnText}>{statusText}</Text>
                </View>
              ) : (
                <View style={styles.btnContentRow}>
                  <Ionicons name="cloud-download-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.updateBtnText}>{statusText}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#111827',
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  iconContainer: {
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(99, 102, 241, 0.35)',
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  updateBtn: {
    flex: 1.3,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  updateBtnDisabled: {
    opacity: 0.75,
  },
  btnContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  updateBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
});

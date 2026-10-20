import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

export type AlertType = 'danger' | 'warning' | 'info';

export interface AlertConfig {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  icon?: keyof typeof Ionicons.glyphMap;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface CustomAlertDialogProps {
  config: AlertConfig;
  onClose: () => void;
}

export const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({ config, onClose }) => {
  const {
    visible,
    title,
    message,
    type = 'danger',
    icon,
    confirmText = 'OK',
    cancelText,
    onConfirm,
    onCancel,
  } = config;

  if (!visible) return null;

  const isConfirmDialog = Boolean(cancelText);

  const getTheme = () => {
    switch (type) {
      case 'danger':
        return {
          icon: icon || 'trash-outline',
          iconColor: Colors.expense,
          iconBg: 'rgba(244, 63, 94, 0.14)',
          iconBorder: 'rgba(244, 63, 94, 0.35)',
          confirmBtnBg: Colors.expense,
          confirmBtnText: '#FFFFFF',
        };
      case 'warning':
        return {
          icon: icon || 'alert-circle-outline',
          iconColor: Colors.warning,
          iconBg: 'rgba(245, 158, 11, 0.14)',
          iconBorder: 'rgba(245, 158, 11, 0.35)',
          confirmBtnBg: Colors.warning,
          confirmBtnText: '#000000',
        };
      case 'info':
      default:
        return {
          icon: icon || 'sparkles-outline',
          iconColor: Colors.primaryLight,
          iconBg: 'rgba(99, 102, 241, 0.14)',
          iconBorder: 'rgba(99, 102, 241, 0.35)',
          confirmBtnBg: Colors.primary,
          confirmBtnText: '#FFFFFF',
        };
    }
  };

  const currentTheme = getTheme();

  const handleConfirm = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    onClose();
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onClose();
    if (onCancel) onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* Top Accent Icon */}
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: currentTheme.iconBg,
                    borderColor: currentTheme.iconBorder,
                  },
                ]}
              >
                <Ionicons
                  name={currentTheme.icon as any}
                  size={26}
                  color={currentTheme.iconColor}
                />
              </View>

              {/* Title & Description */}
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              {/* Buttons Row */}
              {isConfirmDialog ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCancel}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.cancelBtnText}>{cancelText}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.confirmBtn,
                      { backgroundColor: currentTheme.confirmBtnBg },
                    ]}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.confirmBtnText,
                        { color: currentTheme.confirmBtnText },
                      ]}
                    >
                      {confirmText}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.singleBtn,
                    { backgroundColor: currentTheme.confirmBtnBg },
                  ]}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.confirmBtnText,
                      { color: currentTheme.confirmBtnText },
                    ]}
                  >
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#111827',
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl + 4,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.md,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: '#CBD5E1',
  },
  confirmBtn: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.expense,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  singleBtn: {
    width: '100%',
    borderRadius: Radius.lg,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

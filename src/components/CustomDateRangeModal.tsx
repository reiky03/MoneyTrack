import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { DateRange } from '../types';
import { toDateString } from '../utils/dateUtils';

interface CustomDateRangeModalProps {
  visible: boolean;
  currentRange: DateRange;
  onClose: () => void;
  onApply: (range: DateRange) => void;
}

export const CustomDateRangeModal: React.FC<CustomDateRangeModalProps> = ({
  visible,
  currentRange,
  onClose,
  onApply,
}) => {
  const [startDate, setStartDate] = useState(currentRange.startDate);
  const [endDate, setEndDate] = useState(currentRange.endDate);

  const applyPreset = (daysBack: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysBack);
    setStartDate(toDateString(start));
    setEndDate(toDateString(end));
  };

  const applyThisMonth = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(toDateString(first));
    setEndDate(toDateString(last));
  };

  const applyLastMonth = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 0);
    setStartDate(toDateString(first));
    setEndDate(toDateString(last));
  };

  const adjustDate = (
    field: 'start' | 'end',
    unit: 'year' | 'month' | 'day',
    amount: number
  ) => {
    const target = field === 'start' ? startDate : endDate;
    const parts = target.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);

    if (unit === 'year') d.setFullYear(d.getFullYear() + amount);
    if (unit === 'month') d.setMonth(d.getMonth() + amount);
    if (unit === 'day') d.setDate(d.getDate() + amount);

    const formatted = toDateString(d);
    if (field === 'start') {
      setStartDate(formatted);
      if (formatted > endDate) setEndDate(formatted);
    } else {
      setEndDate(formatted);
      if (formatted < startDate) setStartDate(formatted);
    }
  };

  const handleApply = () => {
    onApply({ startDate, endDate });
    onClose();
  };

  const renderDateStepper = (label: string, dateStr: string, field: 'start' | 'end') => {
    const parts = dateStr.split('-');
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return (
      <View style={styles.stepperSection}>
        <Text style={styles.stepperTitle}>{label}</Text>

        <View style={styles.stepperRow}>
          {/* Day */}
          <View style={styles.stepperUnit}>
            <Text style={styles.unitLabel}>Hari</Text>
            <View style={styles.unitControls}>
              <TouchableOpacity
                style={styles.unitButton}
                onPress={() => adjustDate(field, 'day', 1)}
              >
                <Ionicons name="chevron-up" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.unitValue}>{day}</Text>
              <TouchableOpacity
                style={styles.unitButton}
                onPress={() => adjustDate(field, 'day', -1)}
              >
                <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Month */}
          <View style={styles.stepperUnit}>
            <Text style={styles.unitLabel}>Bulan</Text>
            <View style={styles.unitControls}>
              <TouchableOpacity
                style={styles.unitButton}
                onPress={() => adjustDate(field, 'month', 1)}
              >
                <Ionicons name="chevron-up" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.unitValue}>{month}</Text>
              <TouchableOpacity
                style={styles.unitButton}
                onPress={() => adjustDate(field, 'month', -1)}
              >
                <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Year */}
          <View style={styles.stepperUnit}>
            <Text style={styles.unitLabel}>Tahun</Text>
            <View style={styles.unitControls}>
              <TouchableOpacity
                style={styles.unitButton}
                onPress={() => adjustDate(field, 'year', 1)}
              >
                <Ionicons name="chevron-up" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.unitValue}>{year}</Text>
              <TouchableOpacity
                style={styles.unitButton}
                onPress={() => adjustDate(field, 'year', -1)}
              >
                <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Atur Rentang Tanggal</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Quick Preset Buttons */}
            <Text style={styles.presetHeading}>Pilihan Cepat</Text>
            <View style={styles.presetsRow}>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => applyPreset(7)}
              >
                <Text style={styles.presetChipText}>7 Hari Terakhir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => applyPreset(30)}
              >
                <Text style={styles.presetChipText}>30 Hari Terakhir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={applyThisMonth}
              >
                <Text style={styles.presetChipText}>Bulan Ini</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={applyLastMonth}
              >
                <Text style={styles.presetChipText}>Bulan Kemarin</Text>
              </TouchableOpacity>
            </View>

            {/* Steppers */}
            {renderDateStepper('Mulai Dari Tanggal', startDate, 'start')}
            {renderDateStepper('Sampai Dengan Tanggal', endDate, 'end')}

            {/* Summary preview */}
            <View style={styles.previewBox}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primaryLight} />
              <Text style={styles.previewText}>
                {startDate} s/d {endDate}
              </Text>
            </View>
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyBtnText}>Terapkan Periode</Text>
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
  content: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    maxHeight: '85%',
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
  body: {
    marginBottom: Spacing.lg,
  },
  presetHeading: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
    fontWeight: Typography.weights.semibold,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  presetChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  presetChipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  stepperSection: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  stepperTitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stepperUnit: {
    flex: 1,
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  unitControls: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.md,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: '100%',
  },
  unitButton: {
    padding: 4,
  },
  unitValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    marginTop: Spacing.xs,
  },
  previewText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primaryLight,
    fontWeight: Typography.weights.semibold,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { DateRange } from '../types';
import { toDateString } from '../utils/dateUtils';

interface MonthPickerModalProps {
  visible: boolean;
  activeStartDate: string; // YYYY-MM-DD
  onClose: () => void;
  onSelectMonth: (range: DateRange, label: string) => void;
  onSelectPreset: (type: 'this_month' | 'last_month' | 'this_year') => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

const MONTHS_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  visible,
  activeStartDate,
  onClose,
  onSelectMonth,
  onSelectPreset,
}) => {
  const initialDate = new Date(activeStartDate || new Date());
  const [selectedYear, setSelectedYear] = useState<number>(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(initialDate.getMonth());

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const handleApplyMonth = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    const start = new Date(selectedYear, monthIndex, 1);
    const end = new Date(selectedYear, monthIndex + 1, 0);

    const range: DateRange = {
      startDate: toDateString(start),
      endDate: toDateString(end),
    };

    onSelectMonth(range, `${MONTHS_FULL[monthIndex]} ${selectedYear}`);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Pilih Periode Bulan</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Quick Shortcuts */}
          <View style={styles.shortcutsRow}>
            <TouchableOpacity
              style={styles.shortcutChip}
              onPress={() => {
                onSelectPreset('this_month');
                onClose();
              }}
            >
              <Text style={styles.shortcutText}>Bulan Ini</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutChip}
              onPress={() => {
                onSelectPreset('last_month');
                onClose();
              }}
            >
              <Text style={styles.shortcutText}>Bulan Lalu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shortcutChip}
              onPress={() => {
                onSelectPreset('this_year');
                onClose();
              }}
            >
              <Text style={styles.shortcutText}>Tahun Ini</Text>
            </TouchableOpacity>
          </View>

          {/* Year Switcher */}
          <View style={styles.yearRow}>
            <TouchableOpacity
              style={styles.yearArrow}
              onPress={() => setSelectedYear((y) => y - 1)}
            >
              <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.yearText}>{selectedYear}</Text>

            <TouchableOpacity
              style={styles.yearArrow}
              onPress={() => setSelectedYear((y) => y + 1)}
            >
              <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* 12 Months Grid */}
          <View style={styles.monthsGrid}>
            {MONTHS.map((m, idx) => {
              const isSelected =
                selectedMonth === idx &&
                selectedYear === parseInt(activeStartDate.slice(0, 4), 10);
              const isCurrent =
                idx === currentMonth && selectedYear === currentYear;

              return (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.monthBox,
                    isSelected && styles.monthBoxSelected,
                    isCurrent && !isSelected && styles.monthBoxCurrent,
                  ]}
                  onPress={() => handleApplyMonth(idx)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.monthText,
                      isSelected && styles.monthTextSelected,
                      isCurrent && !isSelected && styles.monthTextCurrent,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  container: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    justifyContent: 'center',
  },
  shortcutChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  shortcutText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  yearArrow: {
    padding: Spacing.xs,
  },
  yearText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  monthBox: {
    width: '30%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  monthBoxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  monthBoxCurrent: {
    borderColor: Colors.primaryLight,
  },
  monthText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textSecondary,
  },
  monthTextSelected: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  monthTextCurrent: {
    color: Colors.primaryLight,
    fontWeight: Typography.weights.bold,
  },
});

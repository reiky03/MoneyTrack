import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { DateRange } from '../types';
import { MonthPickerModal } from './MonthPickerModal';
import { toDateString } from '../utils/dateUtils';

const MONTH_NAMES_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const PeriodFilterBar: React.FC = () => {
  const { periodState, setPeriod } = useMoney();
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Parse current active start date
  const startDate = new Date(periodState.range.startDate);
  const currentMonthIdx = startDate.getMonth();
  const currentYear = startDate.getFullYear();

  // Jump to previous month
  const handlePrevMonth = () => {
    const prev = new Date(currentYear, currentMonthIdx - 1, 1);
    const start = new Date(prev.getFullYear(), prev.getMonth(), 1);
    const end = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);

    setPeriod('custom', {
      startDate: toDateString(start),
      endDate: toDateString(end),
    });
  };

  // Jump to next month
  const handleNextMonth = () => {
    const next = new Date(currentYear, currentMonthIdx + 1, 1);
    const start = new Date(next.getFullYear(), next.getMonth(), 1);
    const end = new Date(next.getFullYear(), next.getMonth() + 1, 0);

    setPeriod('custom', {
      startDate: toDateString(start),
      endDate: toDateString(end),
    });
  };

  // Label display: e.g. "Oktober 2026"
  const displayTitle = `${MONTH_NAMES_FULL[currentMonthIdx]} ${currentYear}`;

  const now = new Date();
  const isThisMonth =
    now.getFullYear() === currentYear && now.getMonth() === currentMonthIdx;

  return (
    <View style={styles.container}>
      <View style={styles.navigatorCard}>
        {/* Previous Month Arrow */}
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handlePrevMonth}
          activeOpacity={0.7}
          accessibilityLabel="Bulan Sebelumnya"
        >
          <Ionicons name="chevron-back" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Center Title & Dropdown Trigger */}
        <TouchableOpacity
          style={styles.centerButton}
          onPress={() => setShowMonthPicker(true)}
          activeOpacity={0.7}
        >
          <View style={styles.calendarIconCircle}>
            <Ionicons name="calendar" size={14} color={Colors.primaryLight} />
          </View>
          <Text style={styles.monthTitle}>{displayTitle}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Next Month Arrow */}
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={handleNextMonth}
          activeOpacity={0.7}
          accessibilityLabel="Bulan Berikutnya"
        >
          <Ionicons name="chevron-forward" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Quick "Kembali ke Bulan Ini" shortcut if user navigated away */}
      {!isThisMonth && (
        <TouchableOpacity
          style={styles.returnTodayBadge}
          onPress={() => setPeriod('this_month')}
        >
          <Ionicons name="refresh" size={11} color={Colors.primaryLight} />
          <Text style={styles.returnTodayText}>Kembali ke Bulan Ini</Text>
        </TouchableOpacity>
      )}

      {/* Month & Year Picker Modal */}
      <MonthPickerModal
        visible={showMonthPicker}
        activeStartDate={periodState.range.startDate}
        onClose={() => setShowMonthPicker(false)}
        onSelectMonth={(range) => setPeriod('custom', range)}
        onSelectPreset={(preset) => setPeriod(preset)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  navigatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    width: '100%',
    maxWidth: 380,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  centerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  calendarIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  returnTodayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  returnTodayText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryLight,
  },
});

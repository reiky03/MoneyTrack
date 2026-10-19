import React, { useState } from 'react';
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
import { PeriodType, DateRange } from '../types';
import { CustomDateRangeModal } from './CustomDateRangeModal';

interface PeriodOption {
  type: PeriodType;
  label: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { type: 'this_month', label: 'Bulan Ini' },
  { type: 'last_month', label: 'Bulan Lalu' },
  { type: 'this_week', label: 'Minggu Ini' },
  { type: 'today', label: 'Hari Ini' },
  { type: 'this_year', label: 'Tahun Ini' },
];

export const PeriodFilterBar: React.FC = () => {
  const { periodState, setPeriod } = useMoney();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleCustomApply = (range: DateRange) => {
    setPeriod('custom', range);
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Horizontal Period Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PERIOD_OPTIONS.map((option) => {
          const isActive = periodState.type === option.type;
          return (
            <TouchableOpacity
              key={option.type}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => setPeriod(option.type)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Custom Range Pill */}
        <TouchableOpacity
          style={[styles.pill, periodState.type === 'custom' && styles.pillActive]}
          onPress={() => setShowCustomModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="calendar-outline"
            size={13}
            color={periodState.type === 'custom' ? '#FFFFFF' : Colors.textSecondary}
            style={{ marginRight: 4 }}
          />
          <Text
            style={[
              styles.pillText,
              periodState.type === 'custom' && styles.pillTextActive,
            ]}
          >
            {periodState.type === 'custom' ? 'Kustom' : 'Pilih Tanggal'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Active Range Indicator Pill */}
      <View style={styles.activeRangeContainer}>
        <View style={styles.activeRangeBadge}>
          <Ionicons name="time-outline" size={12} color={Colors.textTertiary} />
          <Text style={styles.activeRangeText}>{periodState.label}</Text>
        </View>
      </View>

      {/* Custom Date Modal */}
      <CustomDateRangeModal
        visible={showCustomModal}
        currentRange={periodState.range}
        onClose={() => setShowCustomModal(false)}
        onApply={handleCustomApply}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  pillText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
  activeRangeContainer: {
    paddingHorizontal: Spacing.xl,
    marginTop: 4,
    flexDirection: 'row',
  },
  activeRangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeRangeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    fontWeight: Typography.weights.medium,
  },
});

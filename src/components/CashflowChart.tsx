import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { useMoney } from '../context/MoneyContext';
import { DailySummary } from '../types';
import { formatCompactRupiah, formatRupiah } from '../utils/formatters';

export const CashflowChart: React.FC = () => {
  const { chartSummaries, isPrivacyMode } = useMoney();
  const [selectedBar, setSelectedBar] = useState<DailySummary | null>(null);

  // Find max value to normalize heights
  const maxVal = Math.max(
    ...chartSummaries.map((item) => Math.max(item.income, item.expense)),
    100000
  );

  const CHART_HEIGHT = 140;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Card Header & Legend */}
        <View style={styles.header}>
          <Text style={styles.title}>Grafik Arus Kas</Text>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.income }]} />
              <Text style={styles.legendText}>Masuk</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.expense }]} />
              <Text style={styles.legendText}>Keluar</Text>
            </View>
          </View>
        </View>

        {/* Selected Tooltip / Info Banner */}
        {selectedBar ? (
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipDate}>{selectedBar.label}:</Text>
            <View style={styles.tooltipValues}>
              <Text style={[styles.tooltipVal, { color: Colors.income }]}>
                +{formatRupiah(selectedBar.income, isPrivacyMode)}
              </Text>
              <Text style={styles.tooltipValDivider}>•</Text>
              <Text style={[styles.tooltipVal, { color: Colors.expense }]}>
                -{formatRupiah(selectedBar.expense, isPrivacyMode)}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.hintText}>
            Ketuk grafik batang untuk melihat detail nominal
          </Text>
        )}

        {/* Chart View */}
        {chartSummaries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada data transaksi di periode ini</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chartScroll}
          >
            {chartSummaries.map((item, index) => {
              const incomeHeight = Math.max(
                4,
                Math.round((item.income / maxVal) * CHART_HEIGHT)
              );
              const expenseHeight = Math.max(
                4,
                Math.round((item.expense / maxVal) * CHART_HEIGHT)
              );
              const isSelected = selectedBar?.date === item.date;

              return (
                <TouchableOpacity
                  key={`${item.date}-${index}`}
                  style={[styles.barColumn, isSelected && styles.barColumnSelected]}
                  onPress={() => setSelectedBar(item)}
                  activeOpacity={0.8}
                >
                  {/* Bars Container */}
                  <View style={[styles.barsWrapper, { height: CHART_HEIGHT }]}>
                    {/* Income Bar */}
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: item.income > 0 ? incomeHeight : 4,
                            backgroundColor:
                              item.income > 0 ? Colors.income : 'rgba(255, 255, 255, 0.05)',
                          },
                        ]}
                      />
                    </View>

                    {/* Expense Bar */}
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: item.expense > 0 ? expenseHeight : 4,
                            backgroundColor:
                              item.expense > 0 ? Colors.expense : 'rgba(255, 255, 255, 0.05)',
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* X-Axis Label */}
                  <Text
                    style={[
                      styles.axisLabel,
                      isSelected && styles.axisLabelSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Max Scale Tag */}
        <View style={styles.scaleFooter}>
          <Text style={styles.scaleText}>
            Skala Maks: {formatCompactRupiah(maxVal)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    marginVertical: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  tooltipContainer: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.md,
    marginVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tooltipDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  tooltipValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tooltipVal: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  tooltipValDivider: {
    color: Colors.textTertiary,
    fontSize: 10,
  },
  hintText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    marginVertical: Spacing.xs,
  },
  chartScroll: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    gap: Spacing.md,
    alignItems: 'flex-end',
    minWidth: '100%',
    justifyContent: 'space-around',
  },
  barColumn: {
    alignItems: 'center',
    paddingHorizontal: 4,
    borderRadius: Radius.sm,
  },
  barColumnSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    width: 28,
    justifyContent: 'center',
  },
  barTrack: {
    width: 10,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    borderRadius: Radius.sm,
  },
  axisLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    fontWeight: Typography.weights.medium,
  },
  axisLabelSelected: {
    color: Colors.primaryLight,
    fontWeight: Typography.weights.bold,
  },
  emptyContainer: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textTertiary,
  },
  scaleFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceBorder,
    paddingTop: Spacing.xs,
    marginTop: Spacing.xs,
    alignItems: 'flex-end',
  },
  scaleText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
});

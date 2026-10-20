import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { CategorySummary } from '../types';
import { formatCompactRupiah, formatRupiah } from '../utils/formatters';
import { Ionicons } from '@expo/vector-icons';

interface PieChartProps {
  data: CategorySummary[];
  isPrivacyMode?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({ data, isPrivacyMode = false }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.totalAmount, 0);

  if (data.length === 0 || total === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="pie-chart-outline" size={40} color={Colors.textTertiary} />
        <Text style={styles.emptyText}>Belum ada data untuk ditampilkan</Text>
      </View>
    );
  }

  // Svg Donut constants
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const activeSlice = selectedIndex !== null ? data[selectedIndex] : null;

  return (
    <View style={styles.container}>
      {/* Donut Graphic */}
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {/* Background ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Slices */}
            {data.map((item, index) => {
              const slicePercent = item.percentage;
              const strokeDasharray = `${(slicePercent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += slicePercent;

              const isSelected = selectedIndex === index;

              return (
                <Circle
                  key={item.categoryId}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  opacity={selectedIndex === null || isSelected ? 1 : 0.35}
                />
              );
            })}
          </G>
        </Svg>

        {/* Center Text Overlay */}
        <View style={styles.centerOverlay}>
          {activeSlice ? (
            <>
              <Text style={styles.centerPercent}>{activeSlice.percentage.toFixed(0)}%</Text>
              <Text style={styles.centerLabel} numberOfLines={1}>
                {activeSlice.categoryName}
              </Text>
              <Text style={styles.centerAmount}>
                {formatCompactRupiah(activeSlice.totalAmount)}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.centerTitle}>TOTAL</Text>
              <Text style={styles.centerTotal} numberOfLines={1}>
                {formatCompactRupiah(total)}
              </Text>
              <Text style={styles.centerSub}>{data.length} Kategori</Text>
            </>
          )}
        </View>
      </View>

      {/* Legend & Breakdown List */}
      <View style={styles.legendList}>
        {data.slice(0, 5).map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={item.categoryId}
              style={[
                styles.legendItem,
                isSelected && styles.legendItemSelected,
              ]}
              onPress={() => setSelectedIndex(isSelected ? null : index)}
              activeOpacity={0.7}
            >
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Ionicons
                name={(item.icon as any) || 'pricetag'}
                size={14}
                color={item.color}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.legendName} numberOfLines={1}>
                {item.categoryName}
              </Text>
              <Text style={styles.legendPercent}>{item.percentage.toFixed(0)}%</Text>
              <Text style={styles.legendAmount}>
                {formatRupiah(item.totalAmount, isPrivacyMode)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  chartWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: Spacing.sm,
  },
  centerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
  },
  centerTitle: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
  },
  centerTotal: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  centerSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  centerPercent: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.heavy,
    color: Colors.primaryLight,
  },
  centerLabel: {
    fontSize: 10,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.bold,
    marginTop: 1,
    maxWidth: 90,
    textAlign: 'center',
  },
  centerAmount: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  legendList: {
    width: '100%',
    marginTop: Spacing.md,
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  legendItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendName: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  legendPercent: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    marginRight: Spacing.md,
  },
  legendAmount: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  emptyContainer: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
  },
});

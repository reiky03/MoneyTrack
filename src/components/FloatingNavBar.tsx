import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

export type NavTab = 'home' | 'transactions' | 'analytics' | 'wallets';

interface FloatingNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onFabPress: () => void;
}

export const FloatingNavBar: React.FC<FloatingNavBarProps> = ({
  activeTab,
  onTabChange,
  onFabPress,
}) => {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.dock}>
        {/* Tab 1: Home / Ringkasan */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabChange('home')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={20}
            color={activeTab === 'home' ? Colors.primaryLight : Colors.textTertiary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'home' && styles.tabLabelActive,
            ]}
          >
            Beranda
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Transaksi Lengkap */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabChange('transactions')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'transactions' ? 'receipt' : 'receipt-outline'}
            size={20}
            color={
              activeTab === 'transactions' ? Colors.primaryLight : Colors.textTertiary
            }
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'transactions' && styles.tabLabelActive,
            ]}
          >
            Transaksi
          </Text>
        </TouchableOpacity>

        {/* Center Elevated FAB: Catat Transaksi */}
        <View style={styles.fabWrapper}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={onFabPress}
            activeOpacity={0.85}
            accessibilityLabel="Catat Transaksi Baru"
          >
            <LinearGradient
              colors={['#6366F1', '#4F46E5', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.fabGradient}
            >
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Tab 3: Analisis & Grafik */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabChange('analytics')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'analytics' ? 'pie-chart' : 'pie-chart-outline'}
            size={20}
            color={
              activeTab === 'analytics' ? Colors.primaryLight : Colors.textTertiary
            }
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'analytics' && styles.tabLabelActive,
            ]}
          >
            Analisis
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Dompet & Akun */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onTabChange('wallets')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'wallets' ? 'wallet' : 'wallet-outline'}
            size={20}
            color={
              activeTab === 'wallets' ? Colors.primaryLight : Colors.textTertiary
            }
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'wallets' && styles.tabLabelActive,
            ]}
          >
            Dompet
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(17, 24, 39, 0.94)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    maxWidth: 420,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 3,
    fontWeight: Typography.weights.medium,
  },
  tabLabelActive: {
    color: Colors.primaryLight,
    fontWeight: Typography.weights.bold,
  },
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -14,
    paddingHorizontal: 4,
  },
  fabButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
});

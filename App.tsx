import React, { useState } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { MoneyProvider } from './src/context/MoneyContext';
import { AlertProvider } from './src/context/AlertContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { WalletsScreen } from './src/screens/WalletsScreen';
import { FloatingNavBar, NavTab } from './src/components/FloatingNavBar';
import { AddTransactionModal } from './src/components/AddTransactionModal';
import { SplashScreen } from './src/components/SplashScreen';
import { Colors } from './src/constants/theme';

function MainApp() {
  const insets = useSafeAreaInsets();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [showAddTxModal, setShowAddTxModal] = useState(false);

  // Status bar height on Android vs insets.top
  const statusBarHeight = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : 0;
  const topSafeInset = Math.max(insets.top, statusBarHeight);
  // Add 8dp breathing room so the app header never collides with Android system icons
  const topPadding = topSafeInset > 0 ? topSafeInset + 8 : 32;

  return (
    <View style={styles.root}>
      <View style={styles.phoneFrame}>
        <View style={[styles.safeArea, { paddingTop: topPadding }]}>
          {/* Active Tab Screen */}
          {currentTab === 'home' && (
            <DashboardScreen
              onNavigateToTransactions={() => setCurrentTab('transactions')}
              onNavigateToAnalytics={() => setCurrentTab('analytics')}
              onAddTransactionPress={() => setShowAddTxModal(true)}
            />
          )}

          {currentTab === 'transactions' && (
            <TransactionsScreen
              onAddPress={() => setShowAddTxModal(true)}
            />
          )}

          {currentTab === 'analytics' && <AnalyticsScreen />}

          {currentTab === 'wallets' && <WalletsScreen />}

          {/* Floating Bottom Navigation Bar */}
          <FloatingNavBar
            activeTab={currentTab}
            onTabChange={setCurrentTab}
            onFabPress={() => setShowAddTxModal(true)}
          />

          {/* Global Quick Add Transaction Modal */}
          <AddTransactionModal
            visible={showAddTxModal}
            onClose={() => setShowAddTxModal(false)}
          />
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts(Ionicons.font);
  const [showSplash, setShowSplash] = useState(true);

  const isReady = fontsLoaded && !showSplash;

  return (
    <SafeAreaProvider>
      <MoneyProvider>
        <AlertProvider>
          <StatusBar style="light" />

          {!isReady ? (
            <SplashScreen onFinish={() => setShowSplash(false)} />
          ) : (
            <MainApp />
          )}
        </AlertProvider>
      </MoneyProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#05070C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 480, // Perfect mobile-first responsive constraint for web/tablet
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
    position: 'relative',
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MoneyProvider } from './src/context/MoneyContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TransactionsScreen } from './src/screens/TransactionsScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { WalletsScreen } from './src/screens/WalletsScreen';
import { FloatingNavBar, NavTab } from './src/components/FloatingNavBar';
import { AddTransactionModal } from './src/components/AddTransactionModal';
import { SplashScreen } from './src/components/SplashScreen';
import { Colors } from './src/constants/theme';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [showAddTxModal, setShowAddTxModal] = useState(false);

  return (
    <SafeAreaProvider>
      <MoneyProvider>
        <StatusBar style="light" />

        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <View style={styles.root}>
            <View style={styles.phoneFrame}>
              <SafeAreaView style={styles.safeArea}>
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
              </SafeAreaView>
            </View>
          </View>
        )}
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

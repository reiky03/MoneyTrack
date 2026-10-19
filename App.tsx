import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MoneyProvider } from './src/context/MoneyContext';
import { DashboardScreen } from './src/screens/DashboardScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <MoneyProvider>
        <StatusBar style="light" />
        <DashboardScreen />
      </MoneyProvider>
    </SafeAreaProvider>
  );
}

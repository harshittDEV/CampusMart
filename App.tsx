import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { MarketplaceProvider } from './src/context';

export default function App() {
  return (
    <SafeAreaProvider>
      <MarketplaceProvider>
        <AppNavigator />
      </MarketplaceProvider>
    </SafeAreaProvider>
  );
}

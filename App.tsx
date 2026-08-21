import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from './src/context/GameContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </GameProvider>
    </SafeAreaProvider>
  );
}

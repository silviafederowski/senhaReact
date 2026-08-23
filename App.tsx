import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppBackground } from './src/components/AppBackground';
import { GameProvider } from './src/context/GameContext';
import { RootNavigator } from './src/navigation/RootNavigator';

enableScreens();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppBackground>
        <GameProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </GameProvider>
      </AppBackground>
    </SafeAreaProvider>
  );
}

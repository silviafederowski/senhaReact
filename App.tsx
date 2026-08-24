import { FuzzyBubbles_400Regular, FuzzyBubbles_700Bold, useFonts } from '@expo-google-fonts/fuzzy-bubbles';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppBackground } from './src/components/AppBackground';
import { WebFrame } from './src/components/WebFrame';
import { GameProvider } from './src/context/GameContext';
import { RootNavigator } from './src/navigation/RootNavigator';

enableScreens();

export default function App() {
  const [activeRoute, setActiveRoute] = useState('Tabuleiro');
  const [fontsLoaded] = useFonts({ FuzzyBubbles_400Regular, FuzzyBubbles_700Bold });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <WebFrame>
        <AppBackground fadeKey={activeRoute}>
          <GameProvider>
            <RootNavigator onRouteChange={setActiveRoute} />
            <StatusBar style="auto" />
          </GameProvider>
        </AppBackground>
      </WebFrame>
    </SafeAreaProvider>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Alert, Animated } from 'react-native';
import { useGame } from '../context/GameContext';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';
import { HistoricoScreen } from '../screens/HistoricoScreen';
import { LegendaScreen } from '../screens/LegendaScreen';
import { TabuleiroScreen } from '../screens/TabuleiroScreen';

const Tab = createBottomTabNavigator();

const transparentTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

// Mimics a notebook page turning: the outgoing/incoming screen rotates around its
// left edge (like a page pinned at the spine) instead of the default cross-fade.
const pageTurnInterpolator = ({ current: { progress } }: { current: { progress: Animated.Value } }) => {
  const rotateY = progress.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-100deg', '0deg', '100deg'],
  });
  const opacity = progress.interpolate({
    inputRange: [-1, -0.6, 0, 0.6, 1],
    outputRange: [0, 0.5, 1, 0.5, 0],
  });

  return {
    sceneStyle: {
      opacity,
      transform: [{ perspective: 1200 }, { rotateY }],
      transformOrigin: 'left',
    },
  };
};

function NullScreen() {
  return null;
}

export function RootNavigator() {
  const { resetGame } = useGame();

  const confirmReset = () => {
    Alert.alert('Resetar jogo', 'Tem certeza que deseja começar um novo jogo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Resetar', style: 'destructive', onPress: resetGame },
    ]);
  };

  return (
    <NavigationContainer theme={transparentTheme}>
      <Tab.Navigator
        detachInactiveScreens
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: 'transparent' },
          headerShadowVisible: false,
          sceneStyle: { backgroundColor: 'transparent' },
          sceneStyleInterpolator: pageTurnInterpolator,
          transitionSpec: { animation: 'timing', config: { duration: 750 } },
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#2f6fed',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen
          name="Tabuleiro"
          component={TabuleiroScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="game-controller-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Configurações"
          component={ConfiguracoesScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Histórico"
          component={HistoricoScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Legenda"
          component={LegendaScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Resetar"
          component={NullScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="refresh-outline" size={size} color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              confirmReset();
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

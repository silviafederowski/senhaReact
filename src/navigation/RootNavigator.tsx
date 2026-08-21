import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Alert } from 'react-native';
import { useGame } from '../context/GameContext';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';
import { HistoricoScreen } from '../screens/HistoricoScreen';
import { LegendaScreen } from '../screens/LegendaScreen';
import { TabuleiroScreen } from '../screens/TabuleiroScreen';

const Tab = createBottomTabNavigator();

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
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
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

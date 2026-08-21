import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';
import { HistoricoScreen } from '../screens/HistoricoScreen';
import { TabuleiroScreen } from '../screens/TabuleiroScreen';

const Tab = createBottomTabNavigator();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <Tab.Screen name="Tabuleiro" component={TabuleiroScreen} />
        <Tab.Screen name="Configurações" component={ConfiguracoesScreen} />
        <Tab.Screen name="Histórico" component={HistoricoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

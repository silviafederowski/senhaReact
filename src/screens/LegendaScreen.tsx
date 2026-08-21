import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowPairIcon, Dot, DotPairIcon, GREEN, YELLOW } from '../components/ResultIcons';

interface LegendEntry {
  icon: React.ReactNode;
  description: string;
  scope: string;
}

const ENTRIES: LegendEntry[] = [
  {
    icon: <DotPairIcon color={GREEN} />,
    description: 'Par de caracteres certo, na posição correta.',
    scope: 'Linha dupla',
  },
  {
    icon: <ArrowPairIcon color={GREEN} />,
    description: 'Par de caracteres invertido (posições trocadas), na posição correta.',
    scope: 'Linha dupla',
  },
  {
    icon: <DotPairIcon color={YELLOW} />,
    description: 'Par de caracteres certo, mas em outra posição.',
    scope: 'Linha dupla',
  },
  {
    icon: <ArrowPairIcon color={YELLOW} />,
    description: 'Par de caracteres invertido, em outra posição.',
    scope: 'Linha dupla',
  },
  {
    icon: <Dot color={GREEN} />,
    description: 'Caractere certo, na posição correta.',
    scope: 'Linha única e linha dupla',
  },
  {
    icon: <Dot color={YELLOW} />,
    description: 'Caractere certo, mas em outra posição.',
    scope: 'Linha única e linha dupla',
  },
];

export function LegendaScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>O que cada ícone significa</Text>
        <Text style={styles.subtitle}>
          Esses são os títulos das colunas na lista de tentativas do tabuleiro.
        </Text>
        {ENTRIES.map((entry, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.iconBox}>{entry.icon}</View>
            <View style={styles.textBox}>
              <Text style={styles.description}>{entry.description}</Text>
              <Text style={styles.scope}>{entry.scope}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  iconBox: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
  },
  scope: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});

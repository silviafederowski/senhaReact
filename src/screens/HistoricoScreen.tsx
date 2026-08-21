import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { HistoryTable } from '../components/HistoryTable';
import { useGame } from '../context/GameContext';

export function HistoricoScreen() {
  const { loading, history, clearHistory } = useGame();

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const onClear = () => {
    Alert.alert('Limpar histórico', 'Tem certeza que deseja apagar todo o histórico de jogos?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearHistory },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Limpar histórico</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Toque em um cabeçalho da tabela para ordenar por essa coluna.</Text>
        <HistoryTable history={history} />
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
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
  },
  clearButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#c0392b',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
});

import React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
      <ScrollView
        contentContainerStyle={styles.content}
        minimumZoomScale={1}
        maximumZoomScale={2.5}
        pinchGestureEnabled
      >
        <TouchableOpacity style={styles.clearButton} onPress={onClear} accessibilityLabel="Limpar histórico">
          <Image source={require('../../assets/eraser.png')} style={styles.clearImage} resizeMode="contain" />
        </TouchableOpacity>
        <HistoryTable history={history} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
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
    marginBottom: 14,
  },
  clearImage: {
    width: 34,
    height: 34,
  },
});

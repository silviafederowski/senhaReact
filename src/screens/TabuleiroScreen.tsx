import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAlphabet } from '../game/alphabet';
import { GuessKeypad } from '../components/GuessKeypad';
import { GuessSlots } from '../components/GuessSlots';
import { ResultTable } from '../components/ResultTable';
import { SecretDisplay } from '../components/SecretDisplay';
import { Timer } from '../components/Timer';
import { useGame } from '../context/GameContext';

export function TabuleiroScreen() {
  const navigation = useNavigation<any>();
  const { loading, currentGame, sessionStartedAt, submitGuess, resetGame, revealPassword } = useGame();
  const [draftA, setDraftA] = useState<string[]>([]);
  const [draftB, setDraftB] = useState<string[]>([]);
  const [secretVisible, setSecretVisible] = useState(false);

  useEffect(() => {
    setDraftA([]);
    setDraftB([]);
    setSecretVisible(false);
  }, [currentGame?.startedAt]);

  if (loading || !currentGame) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const { config } = currentGame;
  const finished = Boolean(currentGame.finishedAt);
  const alphabet = getAlphabet(config.charset);

  const activeIsRowB = config.rows === 2 && draftA.length >= config.length;
  const activeDraft = activeIsRowB ? draftB : draftA;
  const disabledChars = config.allowRepetition ? new Set<string>() : new Set(activeDraft);
  const canType = !finished && activeDraft.length < config.length;
  const canBackspace = !finished && (draftB.length > 0 || draftA.length > 0);
  const canSubmit = !finished && draftA.length === config.length && (config.rows === 1 || draftB.length === config.length);

  const onPressChar = (char: string) => {
    if (activeIsRowB) {
      setDraftB((prev) => [...prev, char]);
    } else {
      setDraftA((prev) => [...prev, char]);
    }
  };

  const onBackspace = () => {
    if (draftB.length > 0) {
      setDraftB((prev) => prev.slice(0, -1));
    } else if (draftA.length > 0) {
      setDraftA((prev) => prev.slice(0, -1));
    }
  };

  const onSubmit = () => {
    submitGuess({ rowA: draftA, rowB: config.rows === 2 ? draftB : undefined });
    setDraftA([]);
    setDraftB([]);
  };

  const onReset = () => {
    Alert.alert('Resetar jogo', 'Tem certeza que deseja começar um novo jogo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Resetar', style: 'destructive', onPress: resetGame },
    ]);
  };

  const onReveal = () => {
    Alert.alert('Revelar senha', 'Isso encerra a tentativa atual. Deseja revelar a senha?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Revelar', style: 'destructive', onPress: revealPassword },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <SecretDisplay
          secret={currentGame.secret}
          rows={config.rows}
          visible={secretVisible}
          onToggle={() => setSecretVisible((v) => !v)}
        />

        <View style={styles.buttonBar}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Histórico')}>
            <Text style={styles.navButtonText}>Histórico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Configurações')}>
            <Text style={styles.navButtonText}>Configurações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={onReset}>
            <Text style={styles.navButtonText}>Resetar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timers}>
          <Timer label="Tempo desta senha" startedAt={currentGame.startedAt} endedAt={currentGame.finishedAt} />
          <Timer label="Tempo deste acesso" startedAt={sessionStartedAt} />
        </View>

        {!finished && (
          <TouchableOpacity style={styles.revealButton} onPress={onReveal}>
            <Text style={styles.revealButtonText}>Revelar senha</Text>
          </TouchableOpacity>
        )}

        {finished && (
          <View style={[styles.banner, currentGame.outcome === 'won' ? styles.bannerWon : styles.bannerRevealed]}>
            <Text style={styles.bannerText}>
              {currentGame.outcome === 'won' ? '🎉 Você acertou a senha! 🎉' : 'Senha revelada:'}
            </Text>
            <Text style={styles.bannerSecret}>
              {currentGame.secret.rowA.join('')}
              {config.rows === 2 ? ` / ${(currentGame.secret.rowB ?? []).join('')}` : ''}
            </Text>
            <TouchableOpacity style={styles.resetHighlight} onPress={onReset}>
              <Text style={styles.resetHighlightText}>Começar novo jogo</Text>
            </TouchableOpacity>
          </View>
        )}

        {!finished && (
          <View style={styles.entry}>
            <GuessSlots length={config.length} values={draftA} rowLabel={config.rows === 2 ? 'L1' : undefined} />
            {config.rows === 2 && <GuessSlots length={config.length} values={draftB} rowLabel="L2" />}
            <GuessKeypad
              alphabet={alphabet}
              disabledChars={disabledChars}
              canType={canType}
              canBackspace={canBackspace}
              canSubmit={canSubmit}
              onPressChar={onPressChar}
              onBackspace={onBackspace}
              onSubmit={onSubmit}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Tentativas</Text>
        <ResultTable rows={config.rows} guesses={currentGame.guesses} />
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
  buttonBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#eef1f8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    fontWeight: '600',
    color: '#2f4a8f',
  },
  timers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  revealButton: {
    alignSelf: 'center',
    backgroundColor: '#8a1f6b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  revealButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  banner: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerWon: {
    backgroundColor: '#e3f8e8',
  },
  bannerRevealed: {
    backgroundColor: '#f5e9f2',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  bannerSecret: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  resetHighlight: {
    backgroundColor: '#1f8a3b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetHighlightText: {
    color: '#fff',
    fontWeight: '700',
  },
  entry: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    color: '#444',
  },
});

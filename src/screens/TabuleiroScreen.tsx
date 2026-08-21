import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getAlphabet } from '../game/alphabet';
import { GuessKeypad } from '../components/GuessKeypad';
import { GuessSlots } from '../components/GuessSlots';
import { ResultTable } from '../components/ResultTable';
import { SecretDisplay } from '../components/SecretDisplay';
import { Timer } from '../components/Timer';
import { useGame } from '../context/GameContext';

function emptyDraft(length: number): string[] {
  return Array(length).fill('');
}

export function TabuleiroScreen() {
  const { loading, currentGame, sessionStartedAt, submitGuess } = useGame();
  const [draftA, setDraftA] = useState<string[]>([]);
  const [draftB, setDraftB] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [secretVisible, setSecretVisible] = useState(false);

  useEffect(() => {
    if (!currentGame) return;
    setDraftA(emptyDraft(currentGame.config.length));
    setDraftB(emptyDraft(currentGame.config.length));
    setSelected(0);
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

  const totalSlots = config.rows === 2 ? config.length * 2 : config.length;
  const selectedRow: 'A' | 'B' = selected < config.length ? 'A' : 'B';
  const selectedLocal = selected < config.length ? selected : selected - config.length;
  const selectedDraft = selectedRow === 'A' ? draftA : draftB;

  const usedElsewhereInSelectedRow = new Set(
    selectedDraft.filter((c, i) => i !== selectedLocal && c !== '')
  );
  const disabledChars = config.allowRepetition ? new Set<string>() : usedElsewhereInSelectedRow;

  const canType = !finished;
  const canClear = !finished && (draftA.some((c) => c !== '') || draftB.some((c) => c !== ''));
  const canSubmit =
    !finished && draftA.every((c) => c !== '') && (config.rows === 1 || draftB.every((c) => c !== ''));

  const onPressChar = (char: string) => {
    if (selectedRow === 'A') {
      setDraftA((prev) => prev.map((c, i) => (i === selectedLocal ? char : c)));
    } else {
      setDraftB((prev) => prev.map((c, i) => (i === selectedLocal ? char : c)));
    }
    setSelected((s) => Math.min(s + 1, totalSlots - 1));
  };

  const onClearAll = () => {
    setDraftA(emptyDraft(config.length));
    setDraftB(emptyDraft(config.length));
    setSelected(0);
  };

  const onSubmit = () => {
    submitGuess({ rowA: draftA, rowB: config.rows === 2 ? draftB : undefined });
    setDraftA(emptyDraft(config.length));
    setDraftB(emptyDraft(config.length));
    setSelected(0);
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

        <View style={styles.timers}>
          <Timer label="Tempo desta senha" startedAt={currentGame.startedAt} endedAt={currentGame.finishedAt} />
          <Timer label="Tempo deste acesso" startedAt={sessionStartedAt} />
        </View>

        {finished && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>🎉 Você acertou a senha! 🎉</Text>
            <Text style={styles.bannerSecret}>
              {currentGame.secret.rowA.join('')}
              {config.rows === 2 ? ` / ${(currentGame.secret.rowB ?? []).join('')}` : ''}
            </Text>
            <Text style={styles.bannerHint}>Toque em Resetar, na barra inferior, para jogar de novo.</Text>
          </View>
        )}

        {!finished && (
          <View style={styles.entry}>
            <GuessSlots
              length={config.length}
              values={draftA}
              selectedIndex={selectedRow === 'A' ? selectedLocal : null}
              onSlotPress={(i) => setSelected(i)}
            />
            {config.rows === 2 && (
              <GuessSlots
                length={config.length}
                values={draftB}
                selectedIndex={selectedRow === 'B' ? selectedLocal : null}
                onSlotPress={(i) => setSelected(config.length + i)}
              />
            )}
            <GuessKeypad
              alphabet={alphabet}
              disabledChars={disabledChars}
              canType={canType}
              canClear={canClear}
              canSubmit={canSubmit}
              onPressChar={onPressChar}
              onClearAll={onClearAll}
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
  timers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  banner: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#e3f8e8',
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
    marginBottom: 8,
  },
  bannerHint: {
    fontSize: 12,
    color: '#3a6b46',
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

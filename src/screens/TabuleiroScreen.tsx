import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getAlphabet } from '../game/alphabet';
import { CelebrationAnimation } from '../components/CelebrationAnimation';
import { CharGrid } from '../components/CharGrid';
import { GuessKeypad } from '../components/GuessKeypad';
import { GuessSlots } from '../components/GuessSlots';
import { ResultTable } from '../components/ResultTable';
import { SecretDisplay } from '../components/SecretDisplay';
import { Timer } from '../components/Timer';
import { useGame } from '../context/GameContext';

function emptyArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

function draftFromPins(length: number, pins: (string | null)[]): string[] {
  return Array.from({ length }, (_, i) => pins[i] ?? '');
}

export function TabuleiroScreen() {
  const { loading, currentGame, sessionStartedAt, submitGuess } = useGame();
  const [draftA, setDraftA] = useState<string[]>([]);
  const [draftB, setDraftB] = useState<string[]>([]);
  const [pinnedA, setPinnedA] = useState<(string | null)[]>([]);
  const [pinnedB, setPinnedB] = useState<(string | null)[]>([]);
  const [selected, setSelected] = useState(0);
  const [secretVisible, setSecretVisible] = useState(false);
  const celebrationScale = useRef(new Animated.Value(0.5)).current;
  const celebrationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!currentGame?.finishedAt) return;
    celebrationScale.setValue(0.5);
    celebrationOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(celebrationScale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      Animated.timing(celebrationOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [currentGame?.finishedAt]);

  useEffect(() => {
    if (!currentGame) return;
    const length = currentGame.config.length;
    setPinnedA(emptyArray(length, null));
    setPinnedB(emptyArray(length, null));
    setDraftA(emptyArray(length, ''));
    setDraftB(emptyArray(length, ''));
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
    setDraftA(draftFromPins(config.length, pinnedA));
    setDraftB(draftFromPins(config.length, pinnedB));
    setSelected(0);
  };

  const onSubmit = () => {
    submitGuess({ rowA: draftA, rowB: config.rows === 2 ? draftB : undefined });
    setDraftA(draftFromPins(config.length, pinnedA));
    setDraftB(draftFromPins(config.length, pinnedB));
    setSelected(0);
  };

  // Tapping a character in the attempts history marks it green (a personal "confirmed"
  // hint) and offers it at that same position/row in the next attempt. Tapping a green
  // one again clears the pin. Each character (row A or row B) toggles independently.
  const onTogglePin = (row: 'A' | 'B', position: number, char: string) => {
    const pins = row === 'A' ? pinnedA : pinnedB;
    const setPins = row === 'A' ? setPinnedA : setPinnedB;
    const setDraft = row === 'A' ? setDraftA : setDraftB;

    const alreadyGreen = pins[position] === char;
    const next = alreadyGreen ? null : char;

    setPins((prev) => prev.map((c, i) => (i === position ? next : c)));
    setDraft((prev) =>
      prev.map((c, i) => {
        if (i !== position) return c;
        if (next !== null) return next;
        return c === char ? '' : c;
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        minimumZoomScale={1}
        maximumZoomScale={2.5}
        pinchGestureEnabled
      >
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
          <Animated.View
            style={[
              styles.banner,
              { opacity: celebrationOpacity, transform: [{ scale: celebrationScale }] },
            ]}
          >
            <CelebrationAnimation key={currentGame.finishedAt} />
            <View style={styles.bannerSecret}>
              <CharGrid
                lines={config.rows === 2 ? [currentGame.secret.rowA, currentGame.secret.rowB ?? []] : [currentGame.secret.rowA]}
                fontSize={24}
                cellWidth={30}
              />
            </View>
          </Animated.View>
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

        <ResultTable
          rows={config.rows}
          guesses={currentGame.guesses}
          pinnedA={pinnedA}
          pinnedB={pinnedB}
          onTogglePin={onTogglePin}
        />
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
  bannerSecret: {
    marginTop: 4,
  },
  entry: {
    marginBottom: 16,
  },
});

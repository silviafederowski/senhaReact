import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { getAlphabet } from '../game/alphabet';
import { CelebratingSecretReveal, totalCelebrationDuration } from '../components/CelebratingSecretReveal';
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

// Reference window height the layout above the attempts table (secret display, timers,
// guess slots + keypad) was designed at. On shorter Android screens, everything there
// shrinks proportionally so it still fits without needing its own scroll -- only the
// attempts table (which has its own internal scroll) is allowed to grow past that space.
const BASELINE_HEIGHT = 780;
const MIN_SCALE = 0.75;

export function TabuleiroScreen() {
  const { loading, currentGame, sessionStartedAt, submitGuess, markCelebrated } = useGame();
  const { height: windowHeight } = useWindowDimensions();
  const scale = Math.min(1, Math.max(MIN_SCALE, windowHeight / BASELINE_HEIGHT));
  const [draftA, setDraftA] = useState<string[]>([]);
  const [draftB, setDraftB] = useState<string[]>([]);
  const [pinnedA, setPinnedA] = useState<(string | null)[]>([]);
  const [pinnedB, setPinnedB] = useState<(string | null)[]>([]);
  const [selected, setSelected] = useState(0);
  const [secretVisible, setSecretVisible] = useState(false);

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

  // Play the celebration only the first time this particular win is seen -- not on every
  // remount (e.g. switching tabs and back, or reopening the app on an already-won game).
  useEffect(() => {
    if (!currentGame?.finishedAt || currentGame.celebrated) return;
    const ms = totalCelebrationDuration(currentGame.secret, currentGame.config.rows);
    const timer = setTimeout(markCelebrated, ms);
    return () => clearTimeout(timer);
  }, [currentGame?.finishedAt, currentGame?.celebrated]);

  if (loading || !currentGame) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const { config } = currentGame;
  const finished = Boolean(currentGame.finishedAt);
  const celebrating = finished && !currentGame.celebrated;
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
  const canClear = !finished;
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
      <View style={[styles.content, { padding: Math.round(16 * scale) }]}>
        {!finished && (
          <SecretDisplay
            secret={currentGame.secret}
            rows={config.rows}
            visible={secretVisible}
            onToggle={() => setSecretVisible((v) => !v)}
            scale={scale}
          />
        )}

        {finished && !celebrating && (
          <View style={[styles.settledSecret, { marginBottom: Math.round(8 * scale) }]}>
            <CharGrid
              lines={config.rows === 2 ? [currentGame.secret.rowA, currentGame.secret.rowB ?? []] : [currentGame.secret.rowA]}
              fontSize={Math.round(20 * scale)}
              cellWidth={Math.round(28 * scale)}
              gap={Math.round(6 * scale)}
            />
            <Text style={styles.hint}>Toque em Resetar, na barra inferior, para jogar de novo.</Text>
          </View>
        )}

        <View style={[styles.timers, { marginBottom: Math.round(12 * scale) }]}>
          <Timer
            label="Tempo desta senha"
            startedAt={currentGame.startedAt}
            endedAt={currentGame.finishedAt}
            scale={scale}
          />
          <Timer label="Tempo deste acesso" startedAt={sessionStartedAt} scale={scale} />
        </View>

        {!finished && (
          <View style={[styles.entry, { marginBottom: Math.round(16 * scale) }]}>
            <GuessSlots
              length={config.length}
              values={draftA}
              selectedIndex={selectedRow === 'A' ? selectedLocal : null}
              onSlotPress={(i) => setSelected(i)}
              scale={scale}
            />
            {config.rows === 2 && (
              <GuessSlots
                length={config.length}
                values={draftB}
                selectedIndex={selectedRow === 'B' ? selectedLocal : null}
                onSlotPress={(i) => setSelected(config.length + i)}
                scale={scale}
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
              scale={scale}
            />
          </View>
        )}

        <View style={styles.tableArea}>
          <ResultTable
            rows={config.rows}
            guesses={currentGame.guesses}
            pinnedA={pinnedA}
            pinnedB={pinnedB}
            onTogglePin={onTogglePin}
          />
        </View>
      </View>

      {celebrating && (
        <>
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.celebrationOverlay} pointerEvents="none">
            <CelebratingSecretReveal
              key={currentGame.finishedAt}
              secret={currentGame.secret}
              rows={config.rows}
              size={46}
              fontSize={32}
            />
            <Text style={styles.hint}>Toque em Resetar, na barra inferior, para jogar de novo.</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tableArea: {
    flex: 1,
    minHeight: 0,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#fff',
  },
  timers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  settledSecret: {
    alignItems: 'center',
    marginBottom: 8,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  entry: {
    marginBottom: 16,
  },
});

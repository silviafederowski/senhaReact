import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAlphabet } from '../game/alphabet';
import { CharGrid } from '../components/CharGrid';
import { CrossedChar } from '../components/CrossedChar';
import { RowsIcon } from '../components/RowsIcon';
import { ShinyGoldBackground } from '../components/ShinyGoldBackground';
import { ShinySilverBackground } from '../components/ShinySilverBackground';
import { useGame } from '../context/GameContext';
import { FONT_BUTTON } from '../styles/fonts';
import { agedGoldShadow } from '../styles/shadows';
import { Charset, GameConfig, RowsMode } from '../types/game';
import { describeEnvironment } from '../utils/environment';

const MIN_LENGTH = 3;
const HARD_MAX_LENGTH = 10;
const ACTIVE_COLOR = '#5c3a06';
const INACTIVE_COLOR = '#000';

function maxLengthFor(charset: Charset, allowRepetition: boolean): number {
  if (allowRepetition) return HARD_MAX_LENGTH;
  return Math.min(HARD_MAX_LENGTH, getAlphabet(charset).length);
}

function PreviewText({
  text,
  secondLine,
  rows,
  color,
}: {
  text: string;
  secondLine: string;
  rows: RowsMode;
  color: string;
}) {
  return (
    <View>
      <Text style={[styles.previewText, { color }]}>{text}</Text>
      {rows === 2 && <Text style={[styles.previewText, { color }]}>{secondLine}</Text>}
    </View>
  );
}

function RepetitionCrossedPreview({ rows, color }: { rows: RowsMode; color: string }) {
  return (
    <View>
      <View style={styles.repetitionRow}>
        <Text style={[styles.previewText, { color }]}>A</Text>
        <CrossedChar char="A" fontSize={18} color={color} />
        <Text style={[styles.previewText, { color }]}>B</Text>
      </View>
      {rows === 2 && (
        <View style={styles.repetitionRow}>
          <Text style={[styles.previewText, { color }]}>A</Text>
          <CrossedChar char="A" fontSize={18} color={color} />
          <Text style={[styles.previewText, { color }]}>B</Text>
        </View>
      )}
    </View>
  );
}

export function ConfiguracoesScreen() {
  const { loading, config, updateConfig } = useGame();
  const [draft, setDraft] = useState<GameConfig>(config);

  useEffect(() => {
    if (!loading) setDraft(config);
  }, [loading]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const repetitionForced = maxLengthFor(draft.charset, false) < draft.length;

  // Any change here is applied immediately and restarts the current game with the new rules.
  const applyChange = (updater: (d: GameConfig) => GameConfig) => {
    setDraft((d) => {
      const next = updater(d);
      updateConfig(next);
      return next;
    });
  };

  const setRows = (rows: RowsMode) => applyChange((d) => ({ ...d, rows }));

  const setCharset = (charset: Charset) => {
    applyChange((d) => {
      const forced = maxLengthFor(charset, false) < d.length;
      const newMax = maxLengthFor(charset, forced ? true : d.allowRepetition);
      return {
        ...d,
        charset,
        allowRepetition: forced ? true : d.allowRepetition,
        length: Math.min(d.length, newMax),
      };
    });
  };

  const changeLength = (delta: number) => {
    applyChange((d) => {
      const newMax = maxLengthFor(d.charset, d.allowRepetition);
      const next = Math.min(newMax, Math.max(MIN_LENGTH, d.length + delta));
      return { ...d, length: next };
    });
  };

  const setAllowRepetition = (allowRepetition: boolean) => {
    applyChange((d) => {
      const newMax = maxLengthFor(d.charset, allowRepetition);
      return { ...d, allowRepetition, length: Math.min(d.length, newMax) };
    });
  };

  const previewLine = Array(draft.length).fill('?');
  const previewLines = draft.rows === 2 ? [previewLine, previewLine] : [previewLine];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        minimumZoomScale={1}
        maximumZoomScale={2.5}
        pinchGestureEnabled
      >
        <View style={[styles.optionGroup, styles.segmented]}>
          <IconButton active={draft.rows === 1} onPress={() => setRows(1)}>
            <RowsIcon rows={1} color={draft.rows === 1 ? ACTIVE_COLOR : INACTIVE_COLOR} />
          </IconButton>
          <IconButton active={draft.rows === 2} onPress={() => setRows(2)}>
            <RowsIcon rows={2} color={draft.rows === 2 ? ACTIVE_COLOR : INACTIVE_COLOR} />
          </IconButton>
        </View>

        <View style={[styles.optionGroup, styles.stepperGroup]}>
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepButton} onPress={() => changeLength(-1)}>
              <View style={styles.stepButtonClip}>
                <ShinyGoldBackground borderRadius={18} />
                <Text style={styles.stepButtonText}>-</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.stepValue}>{draft.length}</Text>
            <TouchableOpacity style={styles.stepButton} onPress={() => changeLength(1)}>
              <View style={styles.stepButtonClip}>
                <ShinyGoldBackground borderRadius={18} />
                <Text style={styles.stepButtonText}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
          <CharGrid lines={previewLines} fontSize={14} cellWidth={18} />
        </View>

        <View style={[styles.optionGroup, styles.segmented]}>
          <IconButton active={draft.charset === 'letters'} onPress={() => setCharset('letters')}>
            <PreviewText
              text="ABC"
              secondLine="HMY"
              rows={draft.rows}
              color={draft.charset === 'letters' ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          </IconButton>
          <IconButton active={draft.charset === 'numbers'} onPress={() => setCharset('numbers')}>
            <PreviewText
              text="123"
              secondLine="704"
              rows={draft.rows}
              color={draft.charset === 'numbers' ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          </IconButton>
          <IconButton active={draft.charset === 'both'} onPress={() => setCharset('both')}>
            <PreviewText
              text="C1X6"
              secondLine="BC91"
              rows={draft.rows}
              color={draft.charset === 'both' ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          </IconButton>
        </View>

        <View style={styles.segmented}>
          <IconButton active={draft.allowRepetition} onPress={() => setAllowRepetition(true)}>
            <PreviewText
              text="AAA"
              secondLine="AAA"
              rows={draft.rows}
              color={draft.allowRepetition ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          </IconButton>
          <IconButton
            active={!draft.allowRepetition}
            onPress={() => setAllowRepetition(false)}
            disabled={repetitionForced}
          >
            <RepetitionCrossedPreview rows={draft.rows} color={!draft.allowRepetition ? ACTIVE_COLOR : INACTIVE_COLOR} />
          </IconButton>
        </View>
        {repetitionForced && (
          <Text style={styles.hint}>
            Com {draft.length} caracteres não é possível evitar repetição neste alfabeto — repetição forçada.
          </Text>
        )}

        <Text style={styles.environmentInfo}>{describeEnvironment()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function IconButton({
  active,
  onPress,
  disabled,
  children,
}: {
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.iconButton, disabled && styles.iconButtonDisabled]}
    >
      <View style={styles.iconButtonClip}>
        {active ? <ShinyGoldBackground borderRadius={18} /> : <ShinySilverBackground borderRadius={18} />}
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
  },
  optionGroup: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#fff',
    width: '100%',
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  iconButton: {
    minWidth: 64,
    borderRadius: 18,
    ...agedGoldShadow,
  },
  iconButtonClip: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonDisabled: {
    opacity: 0.4,
  },
  previewText: {
    fontSize: 20,
    fontFamily: FONT_BUTTON,
    letterSpacing: 1,
    textAlign: 'center',
  },
  repetitionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepperGroup: {
    alignItems: 'center',
    gap: 4,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepButton: {
    width: 58,
    height: 58,
    borderRadius: 18,
    ...agedGoldShadow,
  },
  stepButtonClip: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    color: '#fff',
    fontSize: 28,
    fontFamily: FONT_BUTTON,
  },
  stepValue: {
    fontSize: 20,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  environmentInfo: {
    marginTop: 24,
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },
});

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAlphabet } from '../game/alphabet';
import { useGame } from '../context/GameContext';
import { Charset, GameConfig, RowsMode } from '../types/game';

const MIN_LENGTH = 3;
const HARD_MAX_LENGTH = 10;

function maxLengthFor(charset: Charset, allowRepetition: boolean): number {
  if (allowRepetition) return HARD_MAX_LENGTH;
  return Math.min(HARD_MAX_LENGTH, getAlphabet(charset).length);
}

export function ConfiguracoesScreen() {
  const navigation = useNavigation<any>();
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

  const max = maxLengthFor(draft.charset, draft.allowRepetition);
  const repetitionForced = maxLengthFor(draft.charset, false) < draft.length;

  const setRows = (rows: RowsMode) => setDraft((d) => ({ ...d, rows }));

  const setCharset = (charset: Charset) => {
    setDraft((d) => {
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
    setDraft((d) => {
      const newMax = maxLengthFor(d.charset, d.allowRepetition);
      const next = Math.min(newMax, Math.max(MIN_LENGTH, d.length + delta));
      return { ...d, length: next };
    });
  };

  const setAllowRepetition = (allowRepetition: boolean) => {
    setDraft((d) => {
      const newMax = maxLengthFor(d.charset, allowRepetition);
      return { ...d, allowRepetition, length: Math.min(d.length, newMax) };
    });
  };

  const onSave = () => {
    Alert.alert(
      'Salvar configuração',
      'Isso encerra o jogo atual (se ainda não terminado, será gravado no histórico como não adivinhado) e começa um novo jogo com as novas regras. Confirma?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar e novo jogo',
          onPress: () => {
            updateConfig(draft);
            navigation.navigate('Tabuleiro');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Linhas</Text>
        <View style={styles.segmented}>
          <SegmentButton label="Linha única" active={draft.rows === 1} onPress={() => setRows(1)} />
          <SegmentButton label="Linha dupla" active={draft.rows === 2} onPress={() => setRows(2)} />
        </View>

        <Text style={styles.sectionTitle}>Número de caracteres por linha</Text>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepButton} onPress={() => changeLength(-1)}>
            <Text style={styles.stepButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.stepValue}>{draft.length}</Text>
          <TouchableOpacity style={styles.stepButton} onPress={() => changeLength(1)}>
            <Text style={styles.stepButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>Máximo atual: {max}</Text>

        <Text style={styles.sectionTitle}>Caracteres permitidos</Text>
        <View style={styles.segmented}>
          <SegmentButton label="Só letras" active={draft.charset === 'letters'} onPress={() => setCharset('letters')} />
          <SegmentButton label="Só números" active={draft.charset === 'numbers'} onPress={() => setCharset('numbers')} />
          <SegmentButton label="Letras e números" active={draft.charset === 'both'} onPress={() => setCharset('both')} />
        </View>

        <Text style={styles.sectionTitle}>Repetição de caracteres</Text>
        <View style={styles.segmented}>
          <SegmentButton
            label="Com repetição"
            active={draft.allowRepetition}
            onPress={() => setAllowRepetition(true)}
          />
          <SegmentButton
            label="Sem repetição"
            active={!draft.allowRepetition}
            onPress={() => setAllowRepetition(false)}
            disabled={repetitionForced}
          />
        </View>
        {repetitionForced && (
          <Text style={styles.hint}>
            Com {draft.length} caracteres não é possível evitar repetição neste alfabeto — repetição forçada.
          </Text>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Salvar e novo jogo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SegmentButton({
  label,
  active,
  onPress,
  disabled,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.segmentButton, active && styles.segmentButtonActive, disabled && styles.segmentButtonDisabled]}
    >
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
    marginTop: 18,
    marginBottom: 8,
  },
  segmented: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#eef1f8',
  },
  segmentButtonActive: {
    backgroundColor: '#2f6fed',
  },
  segmentButtonDisabled: {
    opacity: 0.4,
  },
  segmentText: {
    fontWeight: '600',
    color: '#2f4a8f',
  },
  segmentTextActive: {
    color: '#fff',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#2f6fed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
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
    marginTop: 6,
  },
  saveButton: {
    marginTop: 28,
    backgroundColor: '#1f8a3b',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

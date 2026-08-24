import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShinyGoldBackground } from './ShinyGoldBackground';
import { GOLD } from '../styles/colors';
import { FONT_BUTTON } from '../styles/fonts';
import { agedGoldShadow, raisedShadow } from '../styles/shadows';

interface GuessKeypadProps {
  alphabet: string[];
  disabledChars: Set<string>;
  canType: boolean;
  canClear: boolean;
  canSubmit: boolean;
  onPressChar: (char: string) => void;
  onClearAll: () => void;
  onSubmit: () => void;
}

export function GuessKeypad({
  alphabet,
  disabledChars,
  canType,
  canClear,
  canSubmit,
  onPressChar,
  onClearAll,
  onSubmit,
}: GuessKeypadProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {alphabet.map((char) => {
          const disabled = !canType || disabledChars.has(char);
          return (
            <TouchableOpacity
              key={char}
              disabled={disabled}
              onPress={() => onPressChar(char)}
              style={[styles.key, disabled && styles.keyDisabled]}
            >
              <View style={styles.keyClip}>
                {!disabled && <ShinyGoldBackground borderRadius={12} />}
                <Text style={[styles.keyText, disabled && styles.keyTextDisabled]}>{char}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          disabled={!canClear}
          onPress={onClearAll}
          accessibilityLabel="Limpar tudo"
          style={styles.actionButton}
        >
          <View style={raisedShadow}>
            <Image
              source={require('../../assets/eraser.png')}
              style={[styles.actionImage, { opacity: canClear ? 1 : 0.35 }]}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={onSubmit}
          accessibilityLabel="Enviar tentativa"
          style={styles.actionButton}
        >
          <View style={raisedShadow}>
            <Image
              source={require('../../assets/ok.png')}
              style={[styles.actionImage, { opacity: canSubmit ? 1 : 0.35 }]}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  key: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: GOLD,
    ...agedGoldShadow,
  },
  keyClip: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyDisabled: {
    backgroundColor: '#ccc',
  },
  keyText: {
    color: '#5c3a06',
    fontFamily: FONT_BUTTON,
    fontSize: 16,
  },
  keyTextDisabled: {
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionImage: {
    width: 48,
    height: 48,
  },
});

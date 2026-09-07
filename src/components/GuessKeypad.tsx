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
  scale?: number;
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
  scale = 1,
}: GuessKeypadProps) {
  const keySize = Math.round(36 * scale);
  const keyFontSize = Math.round(16 * scale);
  const gap = Math.round(6 * scale);
  const actionsGap = Math.round(8 * scale);
  const actionButtonHeight = Math.round(52 * scale);
  const actionImageSize = Math.round(48 * scale);

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { gap }]}>
        {alphabet.map((char) => {
          const disabled = !canType || disabledChars.has(char);
          return (
            <TouchableOpacity
              key={char}
              disabled={disabled}
              onPress={() => onPressChar(char)}
              style={[
                styles.key,
                { minWidth: keySize, height: keySize, paddingHorizontal: Math.round(6 * scale) },
                disabled && styles.keyDisabled,
              ]}
            >
              <View style={styles.keyClip}>
                {!disabled && <ShinyGoldBackground borderRadius={12} />}
                <Text style={[styles.keyText, { fontSize: keyFontSize }, disabled && styles.keyTextDisabled]}>
                  {char}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[styles.actions, { gap: actionsGap }]}>
        <TouchableOpacity
          disabled={!canClear}
          onPress={onClearAll}
          accessibilityLabel="Limpar tudo"
          style={[styles.actionButton, { height: actionButtonHeight }]}
        >
          <View style={raisedShadow}>
            <Image
              source={require('../../assets/eraser.png')}
              style={[
                styles.actionImage,
                { width: actionImageSize, height: actionImageSize, opacity: canClear ? 1 : 0.35 },
              ]}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canSubmit}
          onPress={onSubmit}
          accessibilityLabel="Enviar tentativa"
          style={[styles.actionButton, { height: actionButtonHeight }]}
        >
          <View style={raisedShadow}>
            <Image
              source={require('../../assets/ok.png')}
              style={[
                styles.actionImage,
                { width: actionImageSize, height: actionImageSize, opacity: canSubmit ? 1 : 0.35 },
              ]}
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
  },
  key: {
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
  },
  keyTextDisabled: {
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionImage: {},
});

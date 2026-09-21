import React, { useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShinyGoldBackground } from './ShinyGoldBackground';
import { GOLD } from '../styles/colors';
import { FONT_BUTTON } from '../styles/fonts';
import { agedGoldShadow, raisedShadow } from '../styles/shadows';

interface GuessKeypadProps {
  alphabet: string[];
  disabledChars: Set<string>;
  excludedChars: Set<string>;
  canType: boolean;
  canClear: boolean;
  canSubmit: boolean;
  onPressChar: (char: string) => void;
  onClearAll: () => void;
  onSubmit: () => void;
  scale?: number;
}

// A key the user double-tapped as excluded (in the attempts history) stays tappable --
// unlike a repetition-disabled key -- but pressing it just flashes red instead of typing
// the character, reinforcing "this one's not in the secret".
function KeypadKey({
  char,
  disabled,
  excluded,
  keySize,
  keyFontSize,
  scale,
  onPressChar,
}: {
  char: string;
  disabled: boolean;
  excluded: boolean;
  keySize: number;
  keyFontSize: number;
  scale: number;
  onPressChar: (char: string) => void;
}) {
  const blink = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (excluded) {
      Animated.sequence([
        Animated.timing(blink, { toValue: 1, duration: 90, useNativeDriver: false }),
        Animated.timing(blink, { toValue: 0, duration: 90, useNativeDriver: false }),
        Animated.timing(blink, { toValue: 1, duration: 90, useNativeDriver: false }),
        Animated.timing(blink, { toValue: 0, duration: 90, useNativeDriver: false }),
      ]).start();
      return;
    }
    onPressChar(char);
  };

  const blinkBackground = blink.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,59,48,0)', 'rgba(255,59,48,0.85)'],
  });

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handlePress}
      style={[
        styles.key,
        { minWidth: keySize, height: keySize, paddingHorizontal: Math.round(6 * scale) },
        disabled && styles.keyDisabled,
        excluded && styles.keyExcluded,
      ]}
    >
      <View style={styles.keyClip}>
        {!disabled && !excluded && <ShinyGoldBackground borderRadius={12} />}
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: blinkBackground }]}
          pointerEvents="none"
        />
        <Text style={[styles.keyText, { fontSize: keyFontSize }, disabled && styles.keyTextDisabled]}>{char}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function GuessKeypad({
  alphabet,
  disabledChars,
  excludedChars,
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
        {alphabet.map((char) => (
          <KeypadKey
            key={char}
            char={char}
            disabled={!canType || disabledChars.has(char)}
            excluded={excludedChars.has(char)}
            keySize={keySize}
            keyFontSize={keyFontSize}
            scale={scale}
            onPressChar={onPressChar}
          />
        ))}
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
  keyExcluded: {
    borderWidth: 2,
    borderColor: '#ff3b30',
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
